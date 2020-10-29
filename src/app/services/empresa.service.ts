import { Empresa } from './../interfaces/empresa';

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private empresaCollection: AngularFirestoreCollection<Empresa>;

  constructor(private afs: AngularFirestore) {
    this.empresaCollection = this.afs.collection<Empresa>('Empresas');
  }
  getEmpresas() {
    return this.empresaCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addEmpresa(user: Empresa) {
    return this.empresaCollection.add(user);
  }

  getEmpresa(id: string) {
    return this.empresaCollection.doc<Empresa>(id).valueChanges();
  }

  updateEmpresa(id: string, user: Empresa) {
    return this.empresaCollection.doc<Empresa>(id).update(user);
  }

  deleteEmpresa(id: string) {
    return this.empresaCollection.doc(id).delete();
  }
}