import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricosPage } from './historicos.page';

const routes: Routes = [
  {
    path: '',
    component: HistoricosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricosPageRoutingModule {}
