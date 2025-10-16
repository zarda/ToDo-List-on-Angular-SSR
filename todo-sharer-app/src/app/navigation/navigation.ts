import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Auth, user, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrls: ['./navigation.scss'],
})
export class Navigation {
  private readonly auth: Auth = inject(Auth);
  private readonly router: Router = inject(Router);

  readonly user = toSignal(user(this.auth));

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }
}