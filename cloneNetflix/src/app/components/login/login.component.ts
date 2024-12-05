import { AfterViewInit, Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  email: string = '';
  password: string = '';

  constructor(private authSrv: AuthService) {}

  ngAfterViewInit(): void {
    this.loadGoogleScript().then(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: environment.idGoogle,
          callback: this.handleCredentialResponse.bind(this)
        });

        const buttonDiv = document.getElementById('buttonDiv');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(
            buttonDiv,
            {
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'pill',
            }
          );
          window.google.accounts.id.prompt(); // Mostra il dialogo One Tap
        }
      }
    }).catch(error => console.error('Errore nel caricamento di Google:', error));
  }

  onLogin() {
    const credentials = { email: this.email, password: this.password };
    this.authSrv.login(credentials).subscribe({
      next: (response) => {
        console.log('Login riuscito:', response);
      },
      error: (err) => {
        console.error('Errore durante il login:', err);
      }
    });
  }

  handleCredentialResponse(response: any) {
    if (response?.credential) {
      this.authSrv.loginGoogle({ token: response.credential }).subscribe({
        next: (response) => {
          console.log('Login con Google riuscito:', response);
        },
        error: (err) => {
          console.error('Errore durante il login con Google:', err);
        }
      });
    } else {
      console.error('Risposta non valida da Google:', response);
    }
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject('Errore nel caricamento dello script Google');
      document.head.appendChild(script);
    });
  }
}
