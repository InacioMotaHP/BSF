import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidoDetalhesPage } from './pedido-detalhes.page';

const routes: Routes = [
  {
    path: '',
    component: PedidoDetalhesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoDetalhesPageRoutingModule {}
