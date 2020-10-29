import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from 'src/environments/environment.prod';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule    
  ],
  providers: [
    StatusBar,
    Camera,
    File,
    SplashScreen,
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
