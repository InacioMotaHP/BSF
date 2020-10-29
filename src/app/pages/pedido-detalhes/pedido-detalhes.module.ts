import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoDetalhesPageRoutingModule } from './pedido-detalhes-routing.module';

import { PedidoDetalhesPage } from './pedido-detalhes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidoDetalhesPageRoutingModule
  ],
  declarations: [PedidoDetalhesPage]
})
export class PedidoDetalhesPageModule {}
