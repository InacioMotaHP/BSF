import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddprodutoPage } from './addproduto.page';

describe('AddprodutoPage', () => {
  let component: AddprodutoPage;
  let fixture: ComponentFixture<AddprodutoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddprodutoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddprodutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
