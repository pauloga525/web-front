import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicaMediaPageComponent } from './basica-media-page.component';

describe('BasicaMediaPageComponent', () => {
  let component: BasicaMediaPageComponent;
  let fixture: ComponentFixture<BasicaMediaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicaMediaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicaMediaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
