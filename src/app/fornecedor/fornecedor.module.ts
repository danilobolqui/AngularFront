import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { EditarComponent } from './editar/editar.component';
import { ExcluirComponent } from './excluir/excluir.component';
import { ListaComponent } from './lista/lista.component';
import { NovoComponent } from './novo/novo.component';
import { FornecedorAppComponent } from './fornecedor.app.component';
import { FornecedorRoutingModule } from './fornecedor.route';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FornecedorService } from './services/fornecedor.service';
import { NgxMaskModule } from 'ngx-mask';
import { FornecedorResolve } from './services/fornecedor.resolve';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FornececedorGuard } from './services/fornecedor.guard';

@NgModule({
  declarations: [
    FornecedorAppComponent,
    DetalhesComponent,
    EditarComponent,
    ExcluirComponent,
    ListaComponent,
    NovoComponent
  ],
  imports: [
    CommonModule,
    FornecedorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    NgxSpinnerModule
  ],
  providers: [
    FornecedorService,
    FornecedorResolve,
    FornececedorGuard
  ]
})
export class FornecedorModule { }
