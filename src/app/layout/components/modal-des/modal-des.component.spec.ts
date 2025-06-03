import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDesComponent } from './modal-des.component';

describe('ModalCatComponent', () => {
  let component: ModalDesComponent;
  let fixture: ComponentFixture<ModalDesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
