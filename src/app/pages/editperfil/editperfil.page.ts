import { EmpresaService } from './../../services/empresa.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, Platform, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Empresa } from '../../interfaces/empresa';
import { Observable, Subscription } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, tap } from 'rxjs/operators';
import { MyData } from '../../interfaces/my-data'
import { Produto } from 'src/app/interfaces/produto';
import { ProductService } from 'src/app/services/produto.service';






@Component({
  selector: 'app-editperfil',
  templateUrl: './editperfil.page.html',
  styleUrls: ['./editperfil.page.scss'],
})
export class EditperfilPage implements OnInit {

  //inconstante

  private BackSubs: Subscription;

  public userRegister: Empresa = {};
  private loading: any;
  validations_form: FormGroup;
  errorMessage: string = '';
  public clickedImage: Observable<string>
  public empresaSub: Subscription;

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

  public refEmpresa = this.afs.firestore.collection('Products');
  public produtoAtualizado: Produto
  public produtos: Produto
  constructor(
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private platform: Platform,
    private registerService: EmpresaService,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private nav: NavController,
    private prodService: ProductService,
  ) {

    //seta coleção de consulta
    this.imageCollection = database.collection<MyData>('ImagensPerfilEmpresa');
  }
  ionViewWillEnter() {
    this.BackSubs = this.platform.backButton.subscribe(() => {
      this.nav.navigateRoot("/home")
    });
    this.presentLoading()
    this.loadDadosEmpresa(); //carrega dados da empresa naentrada
    this.isUploading = false;
    this.isUploaded = false;
  }

  ionViewDidLeave() {
    this.empresaSub.unsubscribe();
    this.BackSubs.unsubscribe();

  }



  async loadDadosEmpresa() {
    this.userRegister.idEmpresa = (await this.authService.getAuth().currentUser).uid;
    this.empresaSub = this.registerService.getEmpresa(this.userRegister.idEmpresa).subscribe(data => {
      this.userRegister = data;
    })
  }
  async updateReg() {
    this.presentLoading()
    this.userRegister.idEmpresa = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado

    if (this.userRegister) {
      this.presentLoading();
      try {

        await this.registerService.updateEmpresa(this.userRegister.idEmpresa, this.userRegister) //atualiza dados do ID com os valores do segundo parametro
        this.updateProdutos(this.userRegister)
        this.presentToast("seus dados foram atualizados");


      } catch (error) {
        this.presentToast("Erro ao atualizar registros");

      } finally {
        this.loadingCtrl.dismiss();
      }
    }
  }


  //atualiza nome da empresa salvoo no produto
  async updateProdutos(dadosEmpresa: Empresa) {
    await this.refEmpresa.where('idEmpresa', '==', this.userRegister.idEmpresa).get().
      then(snapshot => {
        if (snapshot.empty) {
          console.log('nenhum produto atualizado')
          return;
        }

        snapshot.forEach(doc => {
          console.log(dadosEmpresa.name)
          this.produtos = doc.data()

          this.produtos.fornecedor = dadosEmpresa.name

          this.prodService.updateProduct(doc.id, this.produtos)
          return this.produtos;
        });
      })
      .catch(err => {
      });

  }



  ngOnInit() {
    this.validations_form = this.formBuilder.group({


      nome: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])),
      rua: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      numero: new FormControl('', Validators.compose([
        Validators.required
      ])),
      bairro: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cidade: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      telefone1: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.required,
        Validators.minLength(10)
      ])),
      telefone2: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.required,
        Validators.minLength(10)
      ])),
      complemento: new FormControl('', Validators.compose([
      ])),

      cat: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  validation_messages = {

    'nome': [
      { type: 'required', message: 'o nome é obrigatório' },
      { type: 'pattern', message: 'nome invalido' },
      { type: 'minlength', message: 'mínimo de 3 caracteres' }
    ],
    'description': [
      { type: 'required', message: 'uma descrição é obrigatória' },
      { type: 'pattern', message: 'descrição invalida' },
      { type: 'minlength', message: 'mínimo de 3 caracteres' }
    ],
    'rua': [
      { type: 'required', message: 'a rua é obrigatória' },
    ],
    'numero': [
      { type: 'required', message: 'o número é obrigatório' },
    ],
    'bairro': [
      { type: 'required', message: 'o bairro é obrigatório' }
    ],
    'cidade': [
      { type: 'required', message: 'a cidade é obrigatória' }
    ],
    'complemento': [

    ],
    'telefone1': [
      { type: 'required', message: 'um telefone é obrigatório' },
      { type: 'pattern', message: 'telefone invalido' },
      { type: 'minlength', message: 'telefone invalido' }
    ],
    'telefone2': [
      { type: 'pattern', message: 'telefone invalido' },
      { type: 'minlength', message: 'telefone invalido' }
    ],
    'cat': [
      { type: 'required', message: 'selecione uma categoria para sua empresa' }
    ]
  }

  uploadFile(event: FileList) {

    //object
    const file = event.item(0)
    //valida a imagem
    if (file.type.split('/')[0] !== 'image') {
      this.presentAlert();
      //this.userRegister.picture = "../../../assets/imagens/buyers.png"
      return;
    }
    this.isUploading = true;
    this.isUploaded = false;

    this.fileName = file.name;

    //definição da pasta no storage, com nome da pasta/getTime único/nome da imagem
    const path = `ImagemPerfilEmpresa/${new Date().getTime()}_${file.name}`;
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
          this.userRegister.picture = resp;
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

  addImagetoDB(image: MyData) {
    //cria id do documento
    const id = this.database.createId();

    //set documento pelo id
    this.imageCollection.doc(id).set(image).then(resp => {
    }).catch(error => {
      console.log("error " + error);
    });
  }

  // dialog de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      duration: 500,
      message: 'Aguarde...',
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
  cancel() {
    this.router.navigate(['../../home']);
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