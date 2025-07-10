import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComodatoComponent } from './modal-comodato.component';

describe('ModalComodatoComponent', () => {
  let component: ModalComodatoComponent;
  let fixture: ComponentFixture<ModalComodatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComodatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComodatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
