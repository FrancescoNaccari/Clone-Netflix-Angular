import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authSrv: AuthService, private router: Router) {}

  logout() {
    this.authSrv.logout();
    this.router.navigate(['/login']);
  }
}