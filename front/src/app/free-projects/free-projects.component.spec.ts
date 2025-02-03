import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeProjectsComponent } from './free-projects.component';

describe('FreeProjectsComponent', () => {
  let component: FreeProjectsComponent;
  let fixture: ComponentFixture<FreeProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
