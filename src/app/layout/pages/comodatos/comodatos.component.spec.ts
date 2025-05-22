import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComodatosComponent } from './comodatos.component';

describe('ComodatosComponent', () => {
  let component: ComodatosComponent;
  let fixture: ComponentFixture<ComodatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComodatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComodatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
