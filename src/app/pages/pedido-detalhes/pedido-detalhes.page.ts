import { Pedido } from './../../interfaces/pedido';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PedidosService } from 'src/app/services/pedidos.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-pedido-detalhes',
  templateUrl: './pedido-detalhes.page.html',
  styleUrls: ['./pedido-detalhes.page.scss'],
})
export class PedidoDetalhesPage implements OnInit {



  private pedidoSubs: Subscription;
  public pedido: Pedido = {}
  public pedidoProd = new Array<Pedido>();
  public cod: string
  public cond: boolean = true;
  public verm: string = 'ver mais'
  loading: any;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    private pedidoService: PedidosService,
    private alert: AlertController,

  ) {
    this.presentLoading()
    this.cod = this.activatedRoute.snapshot.params['id']; //recupera id passado por url
    this.loadProduct(this.cod)

  }
  ionViewWillLeave() {
    this.pedidoSubs.unsubscribe()
  }

  ngOnInit() {
  }


  ver() {
    this.cond = !this.cond
    if (this.cond == true) {
      this.verm = 'ver mais'
    } else {
      this.verm = 'ver menos'
    }
  }

  async loadProduct(cod: string) {
    this.pedidoSubs = this.pedidoService.getpedidot(cod).subscribe(data => { //retorna todos os produtos
      try {
        this.pedidoProd = []
        this.pedido = data;
        this.pedidoProd.push(Object.assign({}, { produtoPicture: this.pedido.produtoPicture }, { produtoNome: this.pedido.produtoNome }, { produtoPreco: this.pedido.produtoPreco }, { produtoQuantidade: this.pedido.produtoQuantidade }))

      } catch (error) {
        this.presentAlert('Atenção', 'Esse pedido acaba de ser cancelado pelo usuário. Isso só foi possível pois ele ainda não estava marcado como "Em andamento".')
        this.router.navigate(['/home'])
      }
    });

  }

  async confirmAlteracaoStatus(oQueFazer: string, t: string, m: string) {
    const alertc = await this.alert.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: t,
      message: m,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log(oQueFazer)
        }
      }, {
        text: 'Confirmar',
        handler: () => {
          if (oQueFazer == 'recebido') {
            this.pedido.status = "Recebido"
            this.pedidoService.updatepedido(this.cod, this.pedido)
          } else if (oQueFazer == 'emAndamento') {
            this.pedido.status = "Em andamento"
            this.pedidoService.updatepedido(this.cod, this.pedido)
          } else if (oQueFazer == 'cancelar') {
            this.pedido.status = 'Cancelado'
            this.pedidoService.updatepedido(this.cod, this.pedido)
            this.router.navigate(['/home'])

          }

        }
      }]
    });

    await alertc.present();
  }

  async presentAlert(t, m) {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: t,
      message: m,
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirmCancel() {

    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Confirmação de Cancelamento',
      inputs: [

        {
          name: 'Obs',
          type: 'textarea',
          placeholder: 'Adicone o motivo da exclusão (Obrigatório)',
        }

      ],
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
          handler: (alertData) => {
            if (alertData.Obs != "") {
              this.pedido.status = 'Cancelado'
              this.pedido.movitoCancelamento = alertData.Obs
              this.pedidoService.updatepedido(this.cod, this.pedido)
              this.router.navigate(['/home'])
            } else {
              this.presentAlert('Atenção', 'Coloque um feedback para o cliente')
            }
          }
        }
      ]
    });

    await alert.present();
  }
  // dialog de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Carregando...', mode: 'ios', duration: 1000
    });
    return this.loading.present();
  }
  //toast
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }

}
