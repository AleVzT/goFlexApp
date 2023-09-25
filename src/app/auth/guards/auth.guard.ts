import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';


export const isAuthenticatedGuard: CanActivateFn = ( route, state) => {
  const authServices = inject(AuthServices);
  const router = inject(Router);

  if ( authServices.authStatus() === AuthStatus.authenticated ) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false
};
