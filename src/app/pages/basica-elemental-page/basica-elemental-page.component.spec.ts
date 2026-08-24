import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicaElementalPageComponent } from './basica-elemental-page.component';

describe('BasicaElementalPageComponent', () => {
  let component: BasicaElementalPageComponent;
  let fixture: ComponentFixture<BasicaElementalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicaElementalPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicaElementalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
