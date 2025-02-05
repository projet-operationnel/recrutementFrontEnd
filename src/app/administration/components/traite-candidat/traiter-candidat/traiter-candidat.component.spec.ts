import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraiterCandidatComponent } from './traiter-candidat.component';

describe('TraiterCandidatComponent', () => {
  let component: TraiterCandidatComponent;
  let fixture: ComponentFixture<TraiterCandidatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraiterCandidatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraiterCandidatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
