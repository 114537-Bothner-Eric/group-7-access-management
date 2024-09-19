import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideWorkerComponent } from './inside-worker.component';

describe('InsideWorkerComponent', () => {
  let component: InsideWorkerComponent;
  let fixture: ComponentFixture<InsideWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsideWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsideWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
