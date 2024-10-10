import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbautUsComponent } from './abaut-us.component';

describe('AbautUsComponent', () => {
  let component: AbautUsComponent;
  let fixture: ComponentFixture<AbautUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbautUsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbautUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
