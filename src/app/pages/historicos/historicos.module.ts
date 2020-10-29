import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoricosPageRoutingModule } from './historicos-routing.module';

import { HistoricosPage } from './historicos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoricosPageRoutingModule
  ],
  declarations: [HistoricosPage]
})
export class HistoricosPageModule {}
