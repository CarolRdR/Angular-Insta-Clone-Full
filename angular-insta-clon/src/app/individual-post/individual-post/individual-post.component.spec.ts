import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualPostComponent } from './individual-post.component';

describe('IndividualPostComponent', () => {
  let component: IndividualPostComponent;
  let fixture: ComponentFixture<IndividualPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
