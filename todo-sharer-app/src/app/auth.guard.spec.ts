import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth/auth.service';
import { of, Observable } from 'rxjs';

describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', [], {
      user$: of(null)
    });
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow activation when user is authenticated', (done) => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com', displayName: 'Test User', photoURL: null };
    Object.defineProperty(authServiceMock, 'user$', {
      get: () => of(mockUser)
    });

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);
      (result as Observable<boolean>).subscribe((canActivate: boolean) => {
        expect(canActivate).toBeTrue();
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      });
    });
  });

  it('should prevent activation and redirect to login when user is not authenticated', (done) => {
    Object.defineProperty(authServiceMock, 'user$', {
      get: () => of(null)
    });

    TestBed.runInInjectionContext(() => {
      const result = authGuard({} as any, {} as any);
      (result as Observable<boolean>).subscribe((canActivate: boolean) => {
        expect(canActivate).toBeFalse();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
        done();
      });
    });
  });
});
