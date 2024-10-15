import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductPanelComponent } from './admin-product-panel.component';

describe('AdminProductPanelComponent', () => {
  let component: AdminProductPanelComponent;
  let fixture: ComponentFixture<AdminProductPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminProductPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
