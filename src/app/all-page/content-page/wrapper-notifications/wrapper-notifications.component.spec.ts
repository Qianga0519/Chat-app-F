import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperNotificationsComponent } from './wrapper-notifications.component';

describe('WrapperNotificationsComponent', () => {
  let component: WrapperNotificationsComponent;
  let fixture: ComponentFixture<WrapperNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
