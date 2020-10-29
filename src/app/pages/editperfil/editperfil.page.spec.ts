import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditperfilPage } from './editperfil.page';

describe('EditperfilPage', () => {
  let component: EditperfilPage;
  let fixture: ComponentFixture<EditperfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditperfilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
