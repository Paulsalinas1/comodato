import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerComodatoComponent } from './ver-comodato.component';

describe('VerComodatoComponent', () => {
  let component: VerComodatoComponent;
  let fixture: ComponentFixture<VerComodatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerComodatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerComodatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
