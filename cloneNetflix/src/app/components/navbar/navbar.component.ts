import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FilterService, FilterType } from 'src/app/services/filter.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authSrv: AuthService, private router: Router, private filterService: FilterService) {}

  logout() {
    this.authSrv.logout();
    this.router.navigate(['/login']);
  }
  currentFilter: FilterType = 'all';

  setFilter(filter: FilterType, event: Event) {
    event.preventDefault();
    this.currentFilter = filter;
    this.filterService.setFilter(filter);
  }
}
