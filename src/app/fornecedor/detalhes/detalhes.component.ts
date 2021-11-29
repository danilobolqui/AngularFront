import { Component } from '@angular/core';
import { Fornecedor } from '../models/fornecedor';

import { ActivatedRoute } from '@angular/router';
import { FornecedorService } from '../services/fornecedor.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent {

  fornecedor: Fornecedor = new Fornecedor();

  constructor(
    private route: ActivatedRoute,
    private fornecedorService: FornecedorService) {
      //route.params['id'] -> Foi enviado o param dessa forma no curso do Eduardo Pires.
      this.fornecedorService.obterPorId(route.snapshot.params.id)
      .subscribe(fornecedor => this.fornecedor = fornecedor);
  }
}