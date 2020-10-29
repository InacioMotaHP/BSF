import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-historicos',
  templateUrl: './historicos.page.html',
  styleUrls: ['./historicos.page.scss'],
})
export class HistoricosPage implements OnInit {
  private BackSubs: Subscription;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private platform: Platform,
    private nav: NavController,) { 

    }

  ngOnInit() {
  }
  async ionViewWillEnter(){
    this.redirect()
    
    this.BackSubs = this.platform.backButton.subscribe(() => {
      this.nav.navigateRoot("/home")
    });
  }
  ionViewDidLeave() {
    this.BackSubs.unsubscribe();
  }


  async redirect() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Página em desenvolvimento',
      message: 'Você será redirecionado aos seus pedidos!',
      buttons: [
       {
          text: 'Confirmar',
          role: 'cancel',
          handler: () => {
            this.router.navigate(['/home'])
            
          }
        }
      ]
    });

    await alert.present();
  }

}
