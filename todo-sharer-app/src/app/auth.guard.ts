import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * A route guard that checks if a user is authenticated.
 *
 * This guard uses the modern functional approach. It subscribes to the `user$`
 * observable from the `AuthService`.
 *
 * - If the user is authenticated (user object is not null), it allows route activation.
 * - If the user is not authenticated, it redirects them to the '/login' page and
 *   prevents route activation.
 *
 * The `take(1)` operator is crucial to ensure the observable stream completes after
 * the first emission, preventing lingering subscriptions.
 */
export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => !!user),
    tap(isLoggedIn => !isLoggedIn && router.navigate(['/login']))
  );
};