import { EmpresaService } from './../../services/empresa.service';
import { LoadingController, IonSlides, Platform, AlertController, MenuController } from '@ionic/angular';
import { OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Produto } from '../../interfaces/produto';
import { Empresa } from '../../interfaces/empresa';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/produto.service';
import { Pedido } from 'src/app/interfaces/pedido';
import { PedidosService } from 'src/app/services/pedidos.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private refPedidos = this.afs.firestore.collection('Pedido')
  public pedidos = new Array<Pedido>();
  public pedidosEm = new Array<Pedido>();
  public pedidoSubs: Subscription
  public pedido: Pedido;
  loading: any;
  segment = 0;
  selectedSlide: IonSlides;
  BackSubs: Subscription;
  isEmpresaSubs: Subscription;
  public empresa: Empresa;
  msgem: string = ''
  msgaguar: string = ''
  idEmpresa: string;
  constructor(
    private localNotifications: LocalNotifications,
    private empresaService: EmpresaService,
    private alertController: AlertController,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private router: Router,
    private afs: AngularFirestore,
    private authService: AuthService,
    public menuCtrl: MenuController,
    private pedidoservice: PedidosService
  ) { }


  pedSubs: Subscription;
  pedidosTotais = new Array<Pedido>()

  loadPedidosSubs() {
    this.pedSubs = this.pedidoservice.getPedido().subscribe(res => {
      this.pedidosTotais = res;
      try {
        this.loadPedidos()
        this.loadPedidosEm()
        console.log('carregdo')
      } catch (error) {
        console.log(error)
      }
    })
  }




  ngOnInit() {
    this.loadPedidosSubs()
  }

  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(true)
    this.isEmpresa() //verifica identifcação da empresa
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/home") {
        this.confirmExit()
      }
    })

    this.presentLoading()
    this.loadPedidos();
    this.loadPedidosEm();

  }

  ionViewDidLeave() {
    this.BackSubs.unsubscribe()
    this.isEmpresaSubs.unsubscribe()
  }

  async isEmpresa() {
    this.isEmpresaSubs = this.empresaService.getEmpresa((await this.authService.getAuth().currentUser).uid).subscribe(data => {
      if (data) {
        console.log("é Empresa")
      } else {
        this.authService.logout()
        this.alert()
        this.router.navigate(['./login'])
      }
    })
  }

  async loadPedidos() {
    this.pedidos = []
    this.idEmpresa = (await this.authService.getAuth().currentUser).uid
    //console.log(idEmpresa)


    await this.refPedidos.where('fornecedorId', '==', this.idEmpresa ).where('status', '==', 'Realizado').get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msgaguar = 'Sem Novos Pedidos, Tente Atualizar!'
          return;
        }
        snapshot.forEach(doc => {
          this.msgaguar = ''
          this.pedidos.push(Object.assign({}, { cod: doc.id }, doc.data()));
          return this.pedidos;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);

      });
  }

  async loadPedidosEm() {
    this.pedidosEm = []
    this.idEmpresa = (await this.authService.getAuth().currentUser).uid
    console.log(this.idEmpresa)


    await this.refPedidos.where('fornecedorId', '==', this.idEmpresa).where('status', '==', 'Em andamento').get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msgem = 'Sem Pedidos Em Atendimento, Coloque Algum Nesse Status e Tente Atualizar!'
          return;
        }
        snapshot.forEach(doc => {
          this.msgem = ''
          this.pedidosEm.push(Object.assign({}, { cod: doc.id }, doc.data()));
          return this.pedidosEm;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  Visualizar(idPedido: string) {
    this.router.navigate(['../../pedido-detalhes/' + idPedido]);
  }

  async refresh() {
    await this.presentLoading()
    try {
      this.loadPedidos()
      this.loadPedidosEm()
    } catch (error) {
      console.log(error)
    } finally {

    }

  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando Pedidos...',
      mode: 'ios',
      duration: 1000
    });
    return this.loading.present();
  }

  slideOpts = {
    mode: 'ios',
    initialSlide: 0,
    slidePerView: 1,
    speed: 400,

  };
  async segmentChanged(ev) {
    await this.selectedSlide.slideTo(this.segment)

  }
  async slideShanged(slide: IonSlides) {
    this.selectedSlide = slide;
    slide.getActiveIndex().then(selectedIndex => {
      this.segment = selectedIndex
    })
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            navigator["app"].exitApp()
          }
        }
      ]
    });

    await alert.present();
  }

  async alert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Desculpe, você não está cadastrado como fornecedor. Realize o cadastro para logar!',
      buttons: [
        {
          text: 'Confirmar'
        }
      ]
    });

    await alert.present();
  }

}
