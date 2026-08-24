import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaPageComponent } from './biblioteca-page.component';

describe('BibliotecaPageComponent', () => {
  let component: BibliotecaPageComponent;
  let fixture: ComponentFixture<BibliotecaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BibliotecaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
