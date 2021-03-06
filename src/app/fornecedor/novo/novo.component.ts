import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';
import { Validacoes } from 'src/app/utils/validacao';
import { CepConsulta } from '../models/endereco';
import { StringUtils } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class NovoComponent implements OnInit {

  errors: any[] = [];
  fornecedorForm!: FormGroup;
  fornecedor: Fornecedor = new Fornecedor();
  displayMessage: DisplayMessage = {};
  formResult: string = '';
  mudancasNaoSalvas?: boolean;
  validacao!: Validacoes;
  placeHolderCampoDoc = "CPF (Requerido)";
  maskCampoDoc = "000.000.000-00";

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    //Precisa do "<div formGroupName='endereco'>" no html.
    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required, Validators.maxLength(100)]],
      documento: ['', Validators.compose([Validators.required])],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
        endereco: this.fb.group({
          logradouro: ['', [Validators.required]],
          numero: ['', [Validators.required]],
          complemento: [''],
          bairro: ['', [Validators.required]],
          cep: ['', [Validators.required]],
          cidade: ['', [Validators.required]],
          estado: ['', [Validators.required]]
      })     
    });

    //Seta valores padrão nos dados do formulário.
    this.fornecedorForm.patchValue({ tipoFornecedor: '1', Ativo: true });

    this.validacao = new Validacoes(this.fornecedorForm);
  }

  ngAfterViewInit(): void {
    //valueChanges é um observable.
    this.tipoFornecedorForm().valueChanges
      .subscribe(() => {
        this.trocarValidacaoDocumento();
      })
  }

  trocarValidacaoDocumento(){
    if(this.tipoFornecedorForm().value === "1"){
      this.placeHolderCampoDoc = "CPF (Requerido)";
      this.maskCampoDoc = "000.000.000-00";
      this.campoDocumento().clearValidators();
      this.campoDocumento().setValidators([Validators.required, Validacoes.validaCpf]);
    }
    else{
      this.placeHolderCampoDoc = "CNPJ (Requerido)";
      this.maskCampoDoc = "00.000.000/0000-00";      
      this.campoDocumento().clearValidators();
      this.campoDocumento().setValidators([Validators.required, Validacoes.validaCnpj]);
    }
    this.campoDocumento().updateValueAndValidity();
  }

  tipoFornecedorForm(): AbstractControl{
    return this.fornecedorForm.get('tipoFornecedor')!;
  }

  campoDocumento(): AbstractControl{
    return this.fornecedorForm.get('documento')!;
  }

  buscarCep(cep: string){
    cep = StringUtils.somenteNumeros(cep);
    if(cep.length < 8) return;

    this.fornecedorService.consultarCep(cep)
      .subscribe(
          cepRetorno => this.preencherEnderecoConsulta(cepRetorno),
          erro => this.errors.push(erro)
      );
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta){
      //Seta os valores do form filho "endereco".
      this.fornecedorForm.patchValue({
        endereco: {
          logradouro: cepConsulta.logradouro ?? '',
          bairro: cepConsulta.bairro ?? '',
          cep: cepConsulta.cep ?? '',
          cidade: cepConsulta.localidade ?? '',
          estado: cepConsulta.uf ?? ''
        }
      });
  }

  adicionarFornecedor() {
    if (this.fornecedorForm?.dirty && this.fornecedorForm?.valid) {
      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm?.value);
      this.formResult = JSON.stringify(this.fornecedor);

      this.fornecedor.endereco!.cep = StringUtils.somenteNumeros(this.fornecedor.endereco?.cep ?? '');
      this.fornecedor.documento = StringUtils.somenteNumeros(this.fornecedor.documento ?? '');
      this.fornecedor.tipoFornecedor = this.fornecedor.tipoFornecedor == 1 ? +'1' : +'2';

      this.fornecedorService.novoFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );
    }
  }

  processarSucesso(response: any) {
    this.fornecedorForm?.reset();
    this.errors = [];

    this.mudancasNaoSalvas = false;

    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
}