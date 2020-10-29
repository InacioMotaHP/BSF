import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistoricosPage } from './historicos.page';

describe('HistoricosPage', () => {
  let component: HistoricosPage;
  let fixture: ComponentFixture<HistoricosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
