import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAgenda } from './admin-agenda';

describe('AdminAgenda', () => {
  let component: AdminAgenda;
  let fixture: ComponentFixture<AdminAgenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAgenda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAgenda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
