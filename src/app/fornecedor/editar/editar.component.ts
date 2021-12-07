import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta, Endereco } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';
import { Validacoes } from 'src/app/utils/validacao';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StringUtils } from 'src/app/utils/string-utils';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit {

  errors: any[] = [];
  errorsEndereco: any[] = [];
  fornecedorForm!: FormGroup;
  enderecoForm!: FormGroup;

  fornecedor: Fornecedor = new Fornecedor();
  endereco: Endereco = new Endereco();

  displayMessage: DisplayMessage = {};
  textoDocumento: string = '';

  tipoFornecedor?: number;
  formResult: string = '';

  mudancasNaoSalvas?: boolean;

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService) {
    
    //Tem um "resolve" no arquivo de rotas do fornecedor.
    //Busca essa informação ao resolver a rota, para não ter problema com assincronia.
    //Pode ser implementado o spinner para este caso também.
     this.fornecedor = this.route.snapshot.data['fornecedor'];
     this.tipoFornecedor = this.fornecedor.tipoFornecedor;
  }

  ngOnInit() {
    this.spinner.show();

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    }) as FormGroup;

    this.enderecoForm = this.fb.group({
      id: '',
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      fornecedorId: ''
    });

    this.preencherForm();

    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  preencherForm() {
    this.fornecedorForm.patchValue({
      id: this.fornecedor.id,
      nome: this.fornecedor.nome,
      ativo: this.fornecedor.ativo,
      tipoFornecedor: this.fornecedor?.tipoFornecedor?.toString(),
      documento: this.fornecedor.documento
    });

    if (this.tipoFornecedorForm().value === "1") {
      this.documento().setValidators([Validators.required, Validacoes.validaCpf]);
    }
    else {
      this.documento().setValidators([Validators.required, Validacoes.validaCnpj]);
    }
    
    this.enderecoForm.patchValue({
      id: this.fornecedor?.endereco?.id,
      logradouro: this.fornecedor?.endereco?.logradouro,
      numero: this.fornecedor?.endereco?.numero,
      complemento: this.fornecedor?.endereco?.complemento,
      bairro: this.fornecedor?.endereco?.bairro,
      cep: this.fornecedor?.endereco?.cep,
      cidade: this.fornecedor?.endereco?.cidade,
      estado: this.fornecedor?.endereco?.estado
    });
  }

  documento(): AbstractControl {
    return this.fornecedorForm!.get('documento')!;
  }

  tipoFornecedorForm(): AbstractControl {
    return this.fornecedorForm!.get('tipoFornecedor')!;
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
    console.log(cepConsulta);

    //Seta os valores do form filho "endereco".
    this.enderecoForm.patchValue({
        logradouro: cepConsulta.logradouro ?? '',
        bairro: cepConsulta.bairro ?? '',
        cep: cepConsulta.cep ?? '',
        cidade: cepConsulta.localidade ?? '',
        estado: cepConsulta.uf ?? ''
    });
  }  

  editarFornecedor() {
    if (this.fornecedorForm?.dirty && this.fornecedorForm?.valid) {

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);

      this.fornecedorService.atualizarFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  editarEndereco() {
    if (this.enderecoForm.dirty && this.enderecoForm.valid) {

      this.endereco = Object.assign({}, this.endereco, this.enderecoForm.value);

      this.endereco.cep = StringUtils.somenteNumeros(this.endereco.cep!);
      this.endereco.fornecedorId = this.fornecedor.id;

      this.fornecedorService.atualizarEndereco(this.endereco)
        .subscribe(
          () => this.processarSucessoEndereco(this.endereco),
          falha => { this.processarFalhaEndereco(falha) }
        );
    }
  }  

  processarSucesso(response: any) {
    this.errors = [];

    let toast = this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!');
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

  processarSucessoEndereco(endereco: Endereco) {
    this.errors = [];

    this.toastr.success('Endereço atualizado com sucesso!', 'Sucesso!');
    
    //Atualiza endereço na tela com as informações enviadas ao servidor.
    this.fornecedor.endereco = endereco
    this.modalService.dismissAll();
  }

  processarFalhaEndereco(fail: any) {
    this.errorsEndereco = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  abrirModal(content: any){
    this.modalService.open(content);
  }
}