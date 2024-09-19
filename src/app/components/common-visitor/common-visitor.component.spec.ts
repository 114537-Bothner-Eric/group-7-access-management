import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonVisitorComponent } from './common-visitor.component';

describe('CommonVisitorComponent', () => {
  let component: CommonVisitorComponent;
  let fixture: ComponentFixture<CommonVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonVisitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
