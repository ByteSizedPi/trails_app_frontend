import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderTemplateComponent } from './rider-template.component';

describe('RiderTemplateComponent', () => {
  let component: RiderTemplateComponent;
  let fixture: ComponentFixture<RiderTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RiderTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
