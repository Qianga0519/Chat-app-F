import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperMessageComponent } from './wrapper-message.component';

describe('WrapperMessageComponent', () => {
  let component: WrapperMessageComponent;
  let fixture: ComponentFixture<WrapperMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
