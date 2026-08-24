import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreparatoriaPageComponent } from './preparatoria-page.component';

describe('PreparatoriaPageComponent', () => {
  let component: PreparatoriaPageComponent;
  let fixture: ComponentFixture<PreparatoriaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparatoriaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreparatoriaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
