import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecuperacaoPage } from './recuperacao.page';

describe('RecuperacaoPage', () => {
  let component: RecuperacaoPage;
  let fixture: ComponentFixture<RecuperacaoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperacaoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperacaoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
