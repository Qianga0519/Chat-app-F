import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperListPostComponent } from './wrapper-list-post.component';

describe('WrapperListPostComponent', () => {
  let component: WrapperListPostComponent;
  let fixture: ComponentFixture<WrapperListPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperListPostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperListPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
