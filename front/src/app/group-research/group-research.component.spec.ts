import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupResearchComponent } from './group-research.component';

describe('GroupResearchComponent', () => {
  let component: GroupResearchComponent;
  let fixture: ComponentFixture<GroupResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupResearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
