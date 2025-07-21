import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Protege rutas principales
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const admin = JSON.parse(localStorage.getItem('adminActivo') || 'null');

  if (admin && admin.idAdmin) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};

// Protege rutas hijas (opcional, si usas canActivateChild)
export const authGuardChild: CanActivateChildFn = (route, state) => {
  const router = inject(Router);
  const admin = JSON.parse(localStorage.getItem('adminActivo') || 'null');

  if (admin && admin.idAdmin) {
    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }
};
