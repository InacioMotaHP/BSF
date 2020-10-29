import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformativosPage } from './informativos.page';

describe('InformativosPage', () => {
  let component: InformativosPage;
  let fixture: ComponentFixture<InformativosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformativosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformativosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
