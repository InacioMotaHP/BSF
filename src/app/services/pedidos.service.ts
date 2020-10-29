import { Pedido } from './../interfaces/pedido';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {  private pedidoCollection: AngularFirestoreCollection<Pedido>;

  constructor(private afs: AngularFirestore) {
    this.pedidoCollection = this.afs.collection<Pedido>('Pedido');
  }

  getPedido() {
    return this.pedidoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addpedido(pedido: Pedido) {
    return this.pedidoCollection.add(pedido);
  }

  getpedidot(id: string) {
    return this.pedidoCollection.doc<Pedido>(id).valueChanges();
  }

  updatepedido(id: string, pedido: Pedido) {
    return this.pedidoCollection.doc<Pedido>(id).update(pedido);
  }
  
  deletepedido(id: string) {
    return this.pedidoCollection.doc(id).delete();
  }
}