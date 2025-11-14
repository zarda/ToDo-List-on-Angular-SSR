import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../services/auth.service';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: { loginWithGoogle: jasmine.Spy, currentUser: any };
  let routerMock: { navigate: jasmine.Spy };

  beforeEach(() => {
    // Reset mocks for each test to ensure isolation
    authServiceMock = {
      loginWithGoogle: jasmine.createSpy('loginWithGoogle').and.resolveTo(),
      currentUser: signal(null)
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Helper function to set input values
  function clickLoginButton() {
    const button = fixture.debugElement.query(By.css('button[mat-raised-button]'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
  }

  it('should show the login button and not the spinner by default', fakeAsync(() => {
    fixture.detectChanges();
    tick(); // Allow effects to run
    fixture.detectChanges(); // Update view after effects
    const buttonContent = fixture.debugElement.query(By.css('.button-content'));
    const spinnerElement = fixture.debugElement.query(By.css('mat-spinner'));
    const spinnerContainer = spinnerElement?.parent;
    expect(buttonContent).toBeTruthy();
    expect(buttonContent.nativeElement.hidden).toBe(false);
    expect(spinnerContainer?.nativeElement.hidden).toBe(true);
  }));

  it('should show the spinner and hide the button text when login is in progress', fakeAsync(() => {
    fixture.detectChanges();
    
    // Make the mock login take time
    authServiceMock.loginWithGoogle.and.returnValue(new Promise(() => {}));

    clickLoginButton();
    tick();

    const buttonContent = fixture.debugElement.query(By.css('.button-content'));
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));

    expect(buttonContent.nativeElement.hidden).toBe(true);
    expect(spinner).toBeTruthy();
  }));

  it('should call authService.loginWithGoogle when the login button is clicked', () => {
    fixture.detectChanges();
    clickLoginButton();
    expect(authServiceMock.loginWithGoogle).toHaveBeenCalled();
  });

  it('should navigate to "/" on successful login', fakeAsync(() => {
    authServiceMock.loginWithGoogle.and.callFake(() => {
      authServiceMock.currentUser.set({ uid: '123' } as any);
      return Promise.resolve();
    });
    fixture.detectChanges();
    clickLoginButton();
    tick(); // Settle login promise and allow effect to run
    tick(); // allow router.navigate() to complete

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should display an error message on failed login', fakeAsync(() => {
    const error = { code: 'auth/some-error', message: 'An error occurred.' };
    authServiceMock.loginWithGoogle.and.rejectWith(error);
    fixture.detectChanges();

    clickLoginButton();
    tick(); // Settle the rejected promise from login (catch block)
    tick(); // Allow the finally() block in the async login method to complete
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Login failed. Please check console for details.');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it('should navigate away if user is already logged in', fakeAsync(() => {
    // This test needs a specific initial state, so we reset and re-configure the component here.
    TestBed.resetTestingModule();

    const loggedInUserSignal = signal({ uid: '123' } as any);
    const loggedInAuthServiceMock = {
      loginWithGoogle: jasmine.createSpy('loginWithGoogle').and.resolveTo(),
      currentUser: loggedInUserSignal
    };

    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: loggedInAuthServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    const userFixture = TestBed.createComponent(Login);
    userFixture.detectChanges();
    tick(); // Allow effect to run

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should display cancel message when popup is closed by user', fakeAsync(() => {
    const error = { code: 'auth/popup-closed-by-user', message: 'Popup closed' };
    authServiceMock.loginWithGoogle.and.rejectWith(error);
    fixture.detectChanges();

    clickLoginButton();
    tick();
    tick();
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Login was cancelled.');
  }));

  it('should not login if already loading', fakeAsync(() => {
    authServiceMock.loginWithGoogle.and.returnValue(new Promise(() => {}));
    fixture.detectChanges();

    // First click starts loading
    clickLoginButton();
    tick();
    expect(authServiceMock.loginWithGoogle).toHaveBeenCalledTimes(1);

    // Second click should be ignored
    component.login();
    tick();
    expect(authServiceMock.loginWithGoogle).toHaveBeenCalledTimes(1);
  }));

  it('should clear error on new login attempt', fakeAsync(() => {
    const error = { code: 'auth/some-error', message: 'Error' };
    authServiceMock.loginWithGoogle.and.rejectWith(error);
    fixture.detectChanges();

    clickLoginButton();
    tick();
    tick();
    fixture.detectChanges();

    expect((component as any).error()).not.toBeNull();

    // Reset mock for successful login
    authServiceMock.loginWithGoogle.and.resolveTo();
    clickLoginButton();

    // Error should be cleared immediately
    expect((component as any).error()).toBeNull();
  }));
});
