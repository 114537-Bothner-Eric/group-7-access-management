import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsideWorkerComponent } from './outside-worker.component';

describe('OutsideWorkerComponent', () => {
  let component: OutsideWorkerComponent;
  let fixture: ComponentFixture<OutsideWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutsideWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutsideWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
