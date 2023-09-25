import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../services/auth.service';
import { AuthStatus } from '../interfaces/auth-status.enum';


export const isNotAuthenticatedGuard: CanActivateFn = ( route, state) => {
  const authServices = inject(AuthServices);
  const router = inject(Router);
  
  if ( authServices.authStatus() === AuthStatus.authenticated ) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};