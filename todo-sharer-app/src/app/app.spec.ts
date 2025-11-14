import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Renderer2, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { App } from './app';
import { AuthService } from './services/auth.service';

class MockAuthService {
  currentUser = () => null;
  user$ = of(null);
  logout = jasmine.createSpy('logout');
}

class MockRenderer2 {
  addClass = jasmine.createSpy('addClass');
  removeClass = jasmine.createSpy('removeClass');
}

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let renderer: MockRenderer2;
  let document: Document;
  let authService: MockAuthService;

  beforeEach(async () => {
    // Reset localStorage before each test
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Renderer2, useClass: MockRenderer2 },
        { provide: DOCUMENT, useValue: window.document },
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    renderer = fixture.debugElement.injector.get(Renderer2) as unknown as MockRenderer2;
    document = TestBed.inject(DOCUMENT);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Theme switching', () => {
    it('should initialize with light theme by default', () => {
      spyOn(renderer, 'removeClass').and.callThrough();
      fixture.detectChanges(); // ngOnInit
      expect(component.isDarkMode()).toBeFalse();
      expect(renderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
    });

    it('should initialize with dark theme if "dark" is in localStorage', () => {
      spyOn(renderer, 'addClass').and.callThrough();
      localStorage.setItem('theme', 'dark');
      fixture.detectChanges(); // ngOnInit
      expect(component.isDarkMode()).toBeTrue();
      expect(renderer.addClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
    });

    it('should toggle from light to dark theme', () => {
      // Initial state: light
      fixture.detectChanges();
      expect(component.isDarkMode()).toBeFalse();

      spyOn(renderer, 'addClass').and.callThrough();
      // Action: toggle theme
      component.toggleTheme();
      fixture.detectChanges();

      // Assertions      
      expect(component.isDarkMode()).toBeTrue();
      expect(renderer.addClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should toggle from dark to light theme', () => {
      // Initial state: dark
      localStorage.setItem('theme', 'dark');
      fixture.detectChanges();
      expect(component.isDarkMode()).toBeTrue();

      spyOn(renderer, 'removeClass').and.callThrough();
      // Action: toggle theme
      component.toggleTheme();
      fixture.detectChanges();

      // Assertions
      expect(component.isDarkMode()).toBeFalse();
      expect(renderer.removeClass).toHaveBeenCalledWith(document.documentElement, 'dark-theme');
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('should call toggleTheme when the theme switcher button is clicked', () => {
      fixture.detectChanges();
      spyOn(component, 'toggleTheme');

      const button = fixture.debugElement.query(By.css('.theme-switcher'));
      button.triggerEventHandler('click', null);

      expect(component.toggleTheme).toHaveBeenCalled();
    });
  });

  it('should render the navigation component', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // Assuming your navigation component has a selector 'app-navigation'
    expect(compiled.querySelector('app-navigation')).not.toBeNull();
  });
});
