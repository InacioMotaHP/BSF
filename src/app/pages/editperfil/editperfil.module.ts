import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditperfilPageRoutingModule } from './editperfil-routing.module';


import { EditperfilPage } from './editperfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditperfilPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditperfilPage]
})
export class EditperfilPageModule {}
