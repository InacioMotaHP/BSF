import { Component, OnInit } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Pedidos',
      url: './home',
      icon: 'home'
    },
    {
      title: 'Meus Produtos',
      url: './produtos',
      icon: 'apps'
    },
   {
      title: 'Informativos & Promoções',
      url: './informativos',
      icon: 'add'
    },
    {
      title: 'Editar Dados',
      url: './editperfil',
      icon: 'person'
    },
    {
      title: 'Histórico',
      url: './historicos',
      icon: 'stats-chart'

    },
    {
      title: 'Pagamento',
      url: './pagamento',
      icon: 'cash'
    },
    {
      title: 'Ajuda',
      url: './help',
      icon: 'help'
    }
  ];
  public labels = ['inaciomotacrf@gmail.com', '(88)9.9770-2081'];

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afa: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
  }

  logout() {
    return this.afa.logout();
  }
  async confirmLogout() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Deseja realmente sair da sua conta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.logout()
          }
        }
      ]
    });

    await alert.present();
  }
}
