import { TestBed } from '@angular/core/testing';
import { TesterComponent } from './tester.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('TesterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesterComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
      ],
    }).compileComponents();
  });

  it('should create the tester component', () => {
    const fixture = TestBed.createComponent(TesterComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have an invalid form on init', () => {
    const fixture = TestBed.createComponent(TesterComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.form.invalid).toBe(true);
  });
});
