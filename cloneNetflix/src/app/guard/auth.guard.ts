import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authSrv: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {

    return this.authSrv.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;  // L'utente è autenticato
        } else {
          // Salva l'URL che l'utente stava tentando di visitare
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url }  // Passa l'URL di ritorno come parametro di query
          });
        }
      })
    );
  }
  
}
