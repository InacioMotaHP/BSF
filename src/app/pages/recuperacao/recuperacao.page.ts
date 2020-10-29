import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Empresa } from 'src/app/interfaces/empresa';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-recuperacao',
  templateUrl: './recuperacao.page.html',
  styleUrls: ['./recuperacao.page.scss'],
})
export class RecuperacaoPage implements OnInit {

  public userRegister: Empresa = {};
  validations_form: FormGroup;
  loading: any;
  private BackSubs: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authServise: AuthService,
    private platform: Platform,
    private nav: NavController,
    public alertController: AlertController,
    public router: Router) { }

  ngOnInit() {
    this.BackSubs = this.platform.backButton.subscribe(() => {
      this.nav.navigateRoot("/login")
    });

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }
  ionViewDidLeave(){
    this.BackSubs.unsubscribe();
   
  }
  validation_messages = {
    'email': [
      { type: 'required', message: 'o email é obrigatório' },
      { type: 'pattern', message: 'email invalido' }
    ]
  }

  getPassword() {
    try {
      if (this.userRegister.email != '' && this.userRegister.email != undefined) {
        this.authServise.resetPassword(this.userRegister.email)
        this.router.navigate(['./login'])
        this.alertconfirm("Email com link para redefinição de senha enviado para: " + this.userRegister.email)
      } else {
        this.alertconfirm("Preencha o campo 'EMAIL' corretamente!")

      }
    } catch (error) {
      this.alertconfirm(error)
    }

  }

  async alertconfirm(m) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: m,
      mode: 'ios',
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }


}
