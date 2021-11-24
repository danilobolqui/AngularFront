import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DisplayMessage, GenericValidator } from 'src/app/utils/generic-form-validation';
import { Usuario } from '../models/usuario';
import { ContaService } from '../services/conta.service';
import { Validacoes } from 'src/app/utils/validacao';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  usuario!: Usuario;
  validacao!: Validacoes;
  errors: any[] = [];

  constructor(private fb: FormBuilder, private contaService: ContaService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    },
    { 
      updateOn: "blur" 
    });

    this.validacao = new Validacoes(this.loginForm);
  }

  ngAfterViewInit(): void{
  }

  login() {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.usuario = Object.assign({}, this.usuario, this.loginForm.value);

      this.contaService.login(this.usuario)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );
    }
  }

  processarSucesso(response: any){
    this.loginForm.reset();
    this.errors = [];

    this.contaService.LocalStorage.salvarDadosLocaisUsuario(response);

    let toast = this.toastr.success('Login realizado com sucesso!', 'Seja bem vindo!');
    if (toast){
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/home']);
      })
    }
  }

  processarFalha(fail: any){
    this.errors = fail.error.errors;
    this.toastr.error('Ocorreu um erro!', 'Ooops =(');
  }
}