import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformativosPageRoutingModule } from './informativos-routing.module';

import { InformativosPage } from './informativos.page';
//import { IonSlides } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    //IonSlides,
    InformativosPageRoutingModule
  ],
  declarations: [InformativosPage]
})
export class InformativosPageModule {}
