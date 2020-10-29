import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformativosPage } from './informativos.page';

const routes: Routes = [
  {
    path: '',
    component: InformativosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformativosPageRoutingModule {}
