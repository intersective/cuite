import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ElsaGhostComponent } from './elsa-ghost.component';

describe('ElsaGhostComponent', () => {
  let component: ElsaGhostComponent;
  let fixture: ComponentFixture<ElsaGhostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ElsaGhostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElsaGhostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
