import { AngularFirestore } from '@angular/fire/firestore';
import { Empresa } from './../interfaces/empresa';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afa: AngularFireAuth, private afs: AngularFirestore) {
  }


  login(user: Empresa) {
    return this.afa.signInWithEmailAndPassword(user.email, user.password);
  }
  
  async register(user: Empresa) {
    const userRegister = this.afa.createUserWithEmailAndPassword(user.email, user.password);
    const newuser = Object.assign({}, user);

    delete newuser.password;
    delete newuser.passConfirm;

    await this.afs.collection('Empresas').doc((await userRegister).user.uid).set(newuser)
  }

  getAuth() {
    return this.afa;
  }

  logout(){
    return this.afa.signOut();
  }

    resetPassword(email: string){
    return this.afa.sendPasswordResetEmail(email);
  }
}