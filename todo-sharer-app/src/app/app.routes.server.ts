import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client  // CSR for todo-list page
  },
  {
    path: 'login',
    renderMode: RenderMode.Server  // SSR for login page
  }
];
