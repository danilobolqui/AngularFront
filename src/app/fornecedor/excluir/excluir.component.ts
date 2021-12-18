import { Component } from '@angular/core';
import { Fornecedor } from '../models/fornecedor';

import { ActivatedRoute, Router } from '@angular/router';
import { FornecedorService } from '../services/fornecedor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-excluir',
  templateUrl: './excluir.component.html'
})
export class ExcluirComponent {

  fornecedor: Fornecedor = new Fornecedor();
  errors: any[] = [];

  constructor(
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {

    this.fornecedor = this.route.snapshot.data['fornecedor'];
    //Outra forma de fazer: route.params['id'] -> Param enviado dessa forma no curso do Eduardo Pires.
    // this.fornecedorService.obterPorId(route.snapshot.params.id)
    //   .subscribe(fornecedor => this.fornecedor = fornecedor);
  }

  excluirEvento() {
    this.fornecedorService.excluirFornecedor(this.fornecedor.id!)
      .subscribe(
        evento => { this.sucessoExclusao(evento) },
        error => { this.falha(error) }
      );
  }

  sucessoExclusao(evento: any) {

    const toast = this.toastr.success('Fornecedor excluido com Sucesso!', 'Good bye :D');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  falha(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Houve um erro no processamento!', 'Ops! :(');
  }
}
