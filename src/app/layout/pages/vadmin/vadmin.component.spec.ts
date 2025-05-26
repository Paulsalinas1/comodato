import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VadminComponent } from './vadmin.component';

describe('VadminComponent', () => {
  let component: VadminComponent;
  let fixture: ComponentFixture<VadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
