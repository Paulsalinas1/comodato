import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearComodatoComponent } from './crear-comodato.component';

describe('CrearComodatoComponent', () => {
  let component: CrearComodatoComponent;
  let fixture: ComponentFixture<CrearComodatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearComodatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearComodatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
