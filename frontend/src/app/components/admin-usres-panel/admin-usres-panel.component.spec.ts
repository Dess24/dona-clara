import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsresPanelComponent } from './admin-usres-panel.component';

describe('AdminUsresPanelComponent', () => {
  let component: AdminUsresPanelComponent;
  let fixture: ComponentFixture<AdminUsresPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsresPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminUsresPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
