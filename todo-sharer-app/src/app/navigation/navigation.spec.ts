import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../user';

import { Navigation } from './navigation';

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;
  let authServiceMock: Partial<AuthService>;

  // WritableSignal for the mock user
  const mockUserSignal = signal<User | null>(null);

  beforeEach(async () => {
    // Mock for the AuthService
    authServiceMock = {
      currentUser: mockUserSignal,
      logout: jasmine.createSpy('logout').and.resolveTo(),
    };

    await TestBed.configureTestingModule({
      imports: [Navigation],
      providers: [
        provideRouter([]), // Provides the necessary router services for RouterLink
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when user is logged out', () => {
    beforeEach(() => {
      mockUserSignal.set(null);
      fixture.detectChanges();
    });

    it('should show login button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const loginButton = compiled.querySelector('button[routerLink="/login"]');

      expect(loginButton).toBeTruthy();
      expect(loginButton?.textContent).toContain('Login with Google');
    });

    it('should not show user menu button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.user-menu-button')).toBeNull();
    });
  });

  describe('when user is logged in', () => {
    const testUser: User = {
      uid: 'test-uid-123',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: null,
    };

    beforeEach(async () => {
      mockUserSignal.set(testUser);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should show user display name and user menu button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const userName = compiled.querySelector('.user-name');
      const userMenuButton = compiled.querySelector('.user-menu-button');

      expect(userMenuButton).toBeTruthy();
      expect(userName?.textContent).toContain('Test User');
    });

    it('should call authService.logout when logout is triggered', () => {
      // Call the logout method directly since menu items are not rendered until opened
      component.logout();

      expect(authServiceMock.logout).toHaveBeenCalled();
    });
  });
});
