import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController, MenuController, Platform, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Empresa } from '../../interfaces/empresa';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  BackSubs: Subscription;

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private navCtrl: NavController,
    public menuCtrl: MenuController,
    private formBuilder: FormBuilder) {  
  }

  //inconstantes
  public userLogin: Empresa = {};
  loading: any;
  validations_form: FormGroup;
  errorMessage: string = '';

  ionViewWillEnter(){
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/login") {
        this.confirmExit()
      }
    })
    this.menuCtrl.swipeGesture(false)
  }
  ionViewDidLeave() {
    this.BackSubs.unsubscribe();
  }

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
    });
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'o email é obrigatório' },
      { type: 'pattern', message: 'Email invalido' }
    ],
    'password': [
      { type: 'required', message: 'a senha é obrigatória' },
      { type: 'minlength', message: 'a senha precisa de 6 digitos no mínimo' }
    ]
  }


  // REALIZA CONEXÇÃO E LOGIN SE POSSÍVEL
  async login() {
    await this.presentLoading(); //chama loading na tela
    try {
      await this.authService.login(this.userLogin); //realiza login
    } catch (error) {
      this.presentToast(error.message); //mostra se ocorrer erro no autenticação
    } finally {
      this.loading.dismiss(); // tira loading da tela
    }
  }

  // dialog de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'por favor aguarde...',
    });
    return this.loading.present();
  }

  //toast
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
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
  //direciona para cadastro
  redirectCadastro() {
    this.router.navigate(['../../cadastro']);
  }
  redirectRecuperacao() {
    this.router.navigate(['../../recuperacao']);

  }
}


