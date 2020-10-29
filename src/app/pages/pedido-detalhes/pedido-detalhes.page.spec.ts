import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedidoDetalhesPage } from './pedido-detalhes.page';

describe('PedidoDetalhesPage', () => {
  let component: PedidoDetalhesPage;
  let fixture: ComponentFixture<PedidoDetalhesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoDetalhesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoDetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
