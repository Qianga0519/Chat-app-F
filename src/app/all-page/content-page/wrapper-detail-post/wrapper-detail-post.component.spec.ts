import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperDetailPostComponent } from './wrapper-detail-post.component';

describe('WrapperDetailPostComponent', () => {
  let component: WrapperDetailPostComponent;
  let fixture: ComponentFixture<WrapperDetailPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperDetailPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperDetailPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
