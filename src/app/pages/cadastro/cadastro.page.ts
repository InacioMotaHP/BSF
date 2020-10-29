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

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  constructor(
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private nav: NavController,
    private platform: Platform,
    private storage: AngularFireStorage,
    private database: AngularFirestore) {
    this.userRegister.picture = "../../../assets/imagens/buyers.png"
    this.userRegister.complemento = ""

    this.isUploading = false;
    this.isUploaded = false;
    //seta coleção de consulta
    this.imageCollection = database.collection<MyData>('ImagensPerfilEmpresa');
    this.BackSubs = this.platform.backButton.subscribe(() => {
      this.nav.navigateRoot("/login")
    });
  }
  ionViewDidLeave() {
    this.BackSubs.unsubscribe();

  }

  //inconstante
  private BackSubs: Subscription;

  public userRegister: Empresa = {};
  private loading: any;
  validations_form: FormGroup;
  errorMessage: string = '';

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


  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
      passConfirm: new FormControl('', Validators.compose([
        Validators.required,
      ])),
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
    'email': [
      { type: 'required', message: 'o email é obrigatório' },
      { type: 'pattern', message: 'email invalido' }
    ],
    'password': [
      { type: 'required', message: 'a senha é obrigatória' },
      { type: 'minlength', message: 'a senha precisa de 6 digitos no mínimo' }
    ],
    'passConfirm': [
      { type: 'required', message: 'campo obrigatório' },
    ],
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

  async register() { //realiza registro
    await this.presentLoading(); //chama loading na tela

    if (this.userRegister.password == this.userRegister.passConfirm) {
      try {
        await this.authService.register(this.userRegister).then(result => {
          let users = this.afs.collection("Empresas");

          users.add({
            name: this.userRegister.name,
            description: this.userRegister.description,
            email: this.userRegister.email,
            // senha: this.userRegister.password, evitar de salvar senha descriptografada
            telefone1: this.userRegister.telefone1,
            telefone2: this.userRegister.telefone2,
            rua: this.userRegister.rua,
            numero: this.userRegister.numero,
            complemento: this.userRegister.complemento,
            bairro: this.userRegister.bairro,
            //cnpj: this.userRegister.cnpj,
            cidade: this.userRegister.cidade,
            cat: this.userRegister.cat,
            //idEmpresa: this.userRegister.idEmpresa,
            picture: this.userRegister.picture
          })
        })
        this.presentToast('Bem vindo a tribo');
      } catch (error) {
        this.presentToast(error.message); //mostra se ocorrer erro no cadastro
        console.log(error.message); //mostra se ocorrer erro no cadastro

      } finally {
        this.loading.dismiss(); // tira loading da tela
      }
    } else {
      this.loading.dismiss();
      this.presentToast('Senhas não conferem, verifique-as')
    }
  }

  uploadFile(event: FileList) {

    //object
    const file = event.item(0)
    console.log(file)
    
    //valida a imagem
    if (file.type.split('/')[0] !== 'image') {
      this.userRegister.picture = "../../../assets/imagens/buyers.png"
      this.presentAlert('O arquivo '+file.type.split('/')[0]+' não é compatível, por favor, escolha outro!');
    } else {
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
            console.log(resp)
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


  // dialog de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Carregando...', mode: 'ios'
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
  //redirectLogin
  redirectLogin() {
    this.router.navigate(['../../login']);
  }
  async presentAlert(m) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Arquivo não suportado!',
      message: m,
      buttons: [
        {
          text: 'Ok',
        }
      ]
    });

    await alert.present();
  }
}





