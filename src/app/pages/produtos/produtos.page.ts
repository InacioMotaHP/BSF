import { AlertController, LoadingController, Platform, NavController } from '@ionic/angular';
import { OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { Produto } from '../../interfaces/produto';
import { Empresa } from '../../interfaces/empresa';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../services/produto.service';



@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
})
export class ProdutosPage implements OnInit {

  public userRegister: Empresa = {}
  public produtos: Produto = {}
  public produto = new Array<Produto>();
  //private prodSubs: Subscription
  private empSubs: Subscription
  public refEmpresa = this.afs.firestore.collection('Products');
  productsSubscription: Subscription;
  loadGoLista: Produto[];
  loading: any;
  private BackSubs: Subscription;
  msg: string = ''

  constructor(
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private afa: AuthService,
    private prodService: ProductService,
    private empService: EmpresaService,
    private afs: AngularFirestore,
    private platform: Platform,
    private nav: NavController,
    private router: Router
  ) {

  }

  async ionViewWillEnter() { //toda vez que a pagina for exibida executa ->
    this.loadProd(); //carrega dados dos produtos da empresa logada

    this.BackSubs = this.platform.backButton.subscribe(() => {
      this.nav.navigateRoot("/home")
    });

    this.loadEmpresa(); //carrega dados da empresa logada
  }

  async ionViewDidLeave() {
    this.BackSubs.unsubscribe();

    this.empSubs.unsubscribe()
  }

  async ngOnInit() {
  }

  async loadEmpresa() {
    this.userRegister.idEmpresa = (await this.afa.getAuth().currentUser).uid

    this.empSubs = this.empService.getEmpresa(this.userRegister.idEmpresa).subscribe(emp => {
      this.userRegister = emp; //retorna dados da empresa logada
      return this.userRegister
    });
  }

  //CONSULTAS POR PRODUTOS

  async loadProd() {
    this.presentLoading()
    this.userRegister.idEmpresa = (await this.afa.getAuth().currentUser).uid; //retorna id do usuario logado

    this.produto = [];
    await this.refEmpresa.where('idEmpresa', '==', this.userRegister.idEmpresa).orderBy('name').get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msg = "Nenhum produto cadastrado!";
          return;
        }

        snapshot.forEach(doc => {
          this.msg = "";
          this.produto.push(Object.assign({}, { id: doc.id }, doc.data()));  //  adiciona a string doc.id a vara id e faz push do objeto com doc.data(), tudo em um único objeto
          return this.produto;
        });
      })
      .catch(err => {
        this.msg = "Produtos existem, mas ocorreram erros ao exibi-los"
      });

  }

  deleteProduct(id: string) {
    try {
      this.prodService.deleteProduct(id);
      this.ionViewWillEnter(); //recarrega produtos
    } catch {
      alert("erro ao excluir");
    }

  }

  directAddProd() {
    this.router.navigate(['../addproduto']);

  }

  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Deseja realmente excluir este produto?',
      message: 'Este produto será excluído permanentimente!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.deleteProduct(id)
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Buscando seus produtos, por favor aguarde...',
      mode: 'ios',
      duration: 1500
    });
    return this.loading.present();
  }

  //search
  filterList(event) {
    this.initializeItems();
    const searchTerm = event.srcElement.value;
    if (!searchTerm) {
      return
    }
    this.produto = this.produto.filter(currentGoal => {
      if (currentGoal.name && searchTerm) {
        if (currentGoal.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    })
  }
  initializeItems(): void {
    this.loadProducts();
    this.produto = this.loadGoLista;
  }
  async loadProducts() {
    this.productsSubscription = this.prodService.getProducts().subscribe(data => {
      this.loadGoLista = data;
    });
  }
}
