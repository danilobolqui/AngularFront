import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { ContaRoutingModule } from './conta.route';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { ContaAppComponent } from './conta.app.component';
import { ContaService } from './services/conta.service';
import { AppFieldErrorDisplayComponent } from '../validacao/app-field-error-display/app-field-error-display.component';

@NgModule({
  declarations: [
    ContaAppComponent,
    CadastroComponent,
    LoginComponent,
    AppFieldErrorDisplayComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ContaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    ContaService
  ]
})
export class ContaModule { }
