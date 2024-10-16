import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperSearchComponent } from './wrapper-search.component';

describe('WrapperSearchComponent', () => {
  let component: WrapperSearchComponent;
  let fixture: ComponentFixture<WrapperSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
