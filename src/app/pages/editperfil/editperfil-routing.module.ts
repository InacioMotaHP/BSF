import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditperfilPage } from './editperfil.page';

const routes: Routes = [
  {
    path: '',
    component: EditperfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditperfilPageRoutingModule {}
