import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperRightComponent } from './wrapper-right.component';

describe('WrapperRightComponent', () => {
  let component: WrapperRightComponent;
  let fixture: ComponentFixture<WrapperRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
