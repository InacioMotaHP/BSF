import { Produto } from './../interfaces/produto';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsCollection: AngularFirestoreCollection<Produto>;

  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Produto>('Products');
  }
  getProducts() {
    return this.productsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addProduct(product: Produto) {
    return this.productsCollection.add(product);
  }

  getProduct(id: string) {
    return this.productsCollection.doc<Produto>(id).valueChanges();
  }

  updateProduct(id: string, product: Produto) {
    return this.productsCollection.doc<Produto>(id).update(product);
  }

  deleteProduct(id: string) {
    return this.productsCollection.doc(id).delete();
  }
  setProduto(id: string, product:Produto){
    return this.productsCollection.doc(id).set(product)
  }
}