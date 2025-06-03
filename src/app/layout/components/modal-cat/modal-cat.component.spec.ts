import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCatComponent } from './modal-cat.component';

describe('ModalCatComponent', () => {
  let component: ModalCatComponent;
  let fixture: ComponentFixture<ModalCatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
