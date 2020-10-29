import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Categorias } from '../interfaces/categorias';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private catCollection: AngularFirestoreCollection<Categorias>;


  constructor(
    private afs: AngularFirestore
  ) { 
    this.catCollection = this.afs.collection<Categorias>('Categorias');

  }

    //Categorias
    getCategorias() {
      return this.catCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
  
            return { id, ...data };
          });
        })
      );
    }
  
    getCategoria(id: string) {
      return this.catCollection.doc<Categorias>(id).valueChanges();
    }
}
