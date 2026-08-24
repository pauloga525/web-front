import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicaSuperiorPageComponent } from './basica-superior-page.component';

describe('BasicaSuperiorPageComponent', () => {
  let component: BasicaSuperiorPageComponent;
  let fixture: ComponentFixture<BasicaSuperiorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicaSuperiorPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BasicaSuperiorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
