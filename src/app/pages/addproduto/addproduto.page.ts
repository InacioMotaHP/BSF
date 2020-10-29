import { CategoriasService } from './../../services/categorias.service';
import { OnInit } from '@angular/core';
import { Empresa } from '../../interfaces/empresa';
import { EmpresaService } from '../../services/empresa.service';
import { Produto } from '../../interfaces/produto';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ProductService } from '../../services/produto.service';
import { NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';
import { MyData } from '../../interfaces/my-data'
import { Categorias } from 'src/app/interfaces/categorias';

@Component({
  selector: 'app-addproduto',
  templateUrl: './addproduto.page.html',
  styleUrls: ['./addproduto.page.scss'],
})
export class AddprodutoPage implements OnInit {

  catSubs: Subscription;
  categoriasPrimarias = new Array<Categorias>()
  cat: string
  Cat2 = []
  private refCat = this.afs.firestore.collection('Subcategorias');
  private productId: string = null;
  private productSubscription: Subscription;
  private empresaSubscription: Subscription;
  public product: Produto = {};
  private empresaDados: Empresa = {};
  loading: any;

  //image variáveis
  // Upload Task 
  task: AngularFireUploadTask;
  // Progress in percentage
  percentage: Observable<number>;
  // Snapshot of uploading file
  snapshot: Observable<any>;
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  //File detalhes  
  fileName: string;
  fileSize: number;
  //Status check 
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;
  //fim de dados imagem



  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private empresa: EmpresaService,
    private catSevice: CategoriasService,
    private router: Router,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private platform: Platform,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private alertController: AlertController
  ) {
    this.isUploading = false;
    this.isUploaded = false;
    //seta coleção de consulta
    this.imageCollection = database.collection<MyData>('ImagensProdutos');

    this.productId = this.activatedRoute.snapshot.params['id']; //pega id passado por parametros url
    if (this.productId) {
      this.loadProduct(); //carrega produto se houver

    } else {
      this.product.disponivel = true
      this.product.picture = "../../assets/imagens/buyers.png"
    }
    this.loadEmpresa(); //carrega dados da empresa
  }
  ngOnInit() {
  }
  async loadEmpresa() {
    this.product.idEmpresa = (await this.authService.getAuth().currentUser).uid; //pega id do user logado

    this.empresaSubscription = this.empresa.getEmpresa(this.product.idEmpresa).subscribe(data => {
      this.empresaDados = data;
    });

  }
  loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => {
      this.product = data;
      console.log(this.product)
      this.consultarSubcategorias(this.product.pCat)

    });
  }
  async saveProduct() {
    await this.presentLoading("Conectando ao banco de dados...");

    console.log(this.empresaDados)

    this.product.fornecedor = this.empresaDados.name; //fornecedor recebe o nome da empresa
    console.log(this.product)
    if (this.product.name == undefined || this.product.description == undefined || this.product.price == undefined || this.product.categoria == undefined) {
      this.presentToast("preencha todos os campos")
    } else {
      if (this.productId) {
        try {
          console.log(this.product.disponivel)
          await this.productService.updateProduct(this.productId, this.product);
          this.presentToast("Produto atualizado com sucesso!");

        } catch (error) {
          this.presentToast('Erro ao tentar salvar: 1' + error);
          console.log(error)

        }
        finally {
          this.loading.dismiss();
        }
      } else {
        this.product.createdAt = new Date().getTime();

        try {
          await this.productService.addProduct(this.product);
          this.presentToast("Produto salvo com sucesso!");
          this.clearCampos();

        } catch (error) {
          this.presentToast('Erro ao tentar salvar: 2 ' + error);
          console.log(error)
        }

      }
    }

  }
  clearCampos() {
    this.product.name = "";
    this.product.picture = "../../assets/imagens/buyers.png"
    this.product.price = "";
    this.product.categoria = "";
    this.product.unidade = "";
    this.product.description = "";
    this.product.pCat = "";
  }

  uploadFile(event: FileList) {

    //object
    const file = event.item(0)
    //valida a imagem
    if (file.type.split('/')[0] !== 'image') {
      this.presentAlert();
      this.product.picture = "../../assets/imagens/buyers.png"
      return;
    } else {
      this.isUploading = true;
      this.isUploaded = false;

      this.fileName = file.name;

      //definição da pasta no storage, com nome da pasta/getTime único/nome da imagem
      const path = `ImagensProdutos/${new Date().getTime()}_${file.name}`;
      //referencia do storage
      const fileRef = this.storage.ref(path);
      this.task = this.storage.upload(path, file);

      //mostrar percentual
      this.percentage = this.task.percentageChanges();
      this.snapshot = this.task.snapshotChanges().pipe(

        finalize(() => {
          // retorna url da imagem
          this.UploadedFileURL = fileRef.getDownloadURL();
          this.UploadedFileURL.subscribe(resp => {
            this.product.picture = resp;
            this.addImagetoDB({
              name: file.name,
              filepath: resp,
              size: this.fileSize
            });
            this.isUploading = false;
            this.isUploaded = true;
          }, error => {
            console.error(error);
          })
        }),
        tap(snap => {
          this.fileSize = snap.totalBytes;
        })
      )
    }

  }

  addImagetoDB(image: MyData) {
    //cria id do documento
    const id = this.database.createId();

    //set documento pelo id
    this.imageCollection.doc(id).set(image).then(resp => {
    }).catch(error => {
      console.log("error " + error);
    });
  }

  async presentLoading(m) {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: m,
      duration: 1000
    });
    return this.loading.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, mode: 'ios', duration: 1500 });
    toast.present();
  }


  //subcat
  async consultarSubcategorias(cat) {
    this.Cat2 = []
    await this.refCat.where('pai', '==', cat).get().
      then(snapshot => {
        if (snapshot.empty) {
          console.log("nenhum")
          return;
        }

        snapshot.forEach(doc => {
          this.Cat2.push(doc.id)
          return this.Cat2;

        });
        console.log(this.Cat2)

      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  //cat
  loadCat() {
    this.catSubs = this.catSevice.getCategorias().subscribe(data => {
      this.categoriasPrimarias = data
    });
  }

  ionViewDidLeave() {
    this.catSubs.unsubscribe()
  }
  ionViewWillEnter() {

    this.presentLoading('Carregando dados...')
    this.loadCat()

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Arquivo não suportado!',
      message: 'Este arquivo não é compatível, por favor, escolha outro!',
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });

    await alert.present();
  }

}
