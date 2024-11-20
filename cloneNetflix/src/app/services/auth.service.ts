import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment.development';
import { AuthData } from '../interface/auth-data.interface';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private authSub: BehaviorSubject<AuthData | null> = new BehaviorSubject<AuthData | null>(null);
  public user$: Observable<AuthData | null> = this.authSub.asObservable();
  private timeout!: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService

  ) {     this.restore(); // Ripristina l'utente all'avvio
  }

  register(data: { username: string, password: string, email: string, nome: string, cognome: string }) {
    return this.http.post(`${environment.apiBack}auth/register`, data).pipe(catchError(this.errors.bind(this)));
  }

  loginGoogle(token: any) {
    return this.http.post<AuthData>(`${environment.apiBack}auth/login/oauth2/code/google`, token).pipe(
      tap(async (user) => {
        this.authSub.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.autoLogout(user);
      })
    );
  }

  login(data: { email: string, password: string }) {
    return this.http.post<AuthData>(`${environment.apiBack}auth/login`, data).pipe(
      tap(async (user) => {
        console.log('Risposta dal server:', user); // Aggiungi questo log per verificare il contenuto
        this.authSub.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.autoLogout(user);
      }),
      catchError(this.errors.bind(this))
    );
  }
  
  updateUser(data: User) {
    const datas = this.authSub.getValue();
    if (datas) {
      datas.user = data;
    }
    this.authSub.next(datas);
    localStorage.setItem('user', JSON.stringify(datas));
  }
  setLoggedIn(user: AuthData) {
    this.authSub.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.authSub.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.initializeGoogleLogin();
  }

  private initializeGoogleLogin() {
    window.location.reload();  // Ricarica la pagina per reinizializzare il login di Google
  }


    // Metodo per gestione automatica del logout
  private autoLogout(data: AuthData) {
    const dataExp = this.jwtHelper.getTokenExpirationDate(data.accessToken) as Date;
    const msExp = dataExp.getTime() - new Date().getTime();
    this.timeout = setTimeout(() => {
      this.logout();
    }, msExp);
  }
  async restore() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    }
    const user: AuthData = JSON.parse(userJson);

    // Verifica se il token è ancora valido
    if (this.jwtHelper.isTokenExpired(user.accessToken)) {
      this.logout();
    } else {
      this.authSub.next(user);
      this.autoLogout(user);
    }
  }

// Metodo per richiedere il reset della password
forgotPassword(email: string): Observable<any> {
  return this.http.post(`${environment.apiBack}auth/forgot-password`, { email }).pipe(
    tap(response => {
      console.log('Risposta dal server:', response);
    }),
    catchError(this.errors.bind(this))
  );
}

// Metodo per reimpostare la password
resetPassword(token: string, newPassword: string): Observable<any> {
  const data = { token, newPassword };
  return this.http.post(`${environment.apiBack}auth/reset-password`, data).pipe(
    tap(response => {
      console.log('Risposta dal server:', response);
    }),
    catchError(this.errors.bind(this))
  );
}

// Metodo per gestire gli errori
private errors(err: any) {
  let errorKey = '';
  console.log('Dettagli dell\'errore:', err); // Log per debugging

  // Se err.error è un oggetto e contiene il campo message
  if (err.error && err.error.message) {
    switch (err.error.message) {
      case 'Email already exists':
        errorKey = 'auth.EMAIL_EXISTS';
        break;
      case 'Incorrect password':
        errorKey = 'auth.INCORRECT_PASSWORD';
        break;
      case 'Cannot find user':
        errorKey = 'auth.USER_NOT_FOUND';
        break;
      case 'Password is too short':
        errorKey = 'auth.PASSWORD_TOO_SHORT';
        break;
      case 'Token expired':
        errorKey = 'auth.TOKEN_EXPIRED';
        break;
      case 'Invalid token':
        errorKey = 'auth.INVALID_TOKEN';
        break;
      default:
        console.error('Errore non gestito:', err); // Log dell'errore non gestito
        errorKey = 'auth.DEFAULT_ERROR';
        break;
    }
  } else {
    console.warn('Errore ricevuto come testo o struttura inattesa:', err);
    errorKey = 'auth.DEFAULT_ERROR';
  }

  const errorMessage = this.translate.instant(errorKey);
  return throwError(errorMessage);
}

  isAuthenticated(): boolean {
    return this.authSub.value !== null;
  }
}
