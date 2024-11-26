import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FilterService, FilterType } from 'src/app/services/filter.service';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  searchQuery: string = '';

  constructor(private authSrv: AuthService, private router: Router, private filterService: FilterService, private moviesService: MoviesService) {}

  logout() {
    this.authSrv.logout();
    this.router.navigate(['/']);
  }
  currentFilter: FilterType = 'all';

  setFilter(filter: FilterType, event: Event) {
    event.preventDefault();
    this.currentFilter = filter;
    this.filterService.setFilter(filter);

  }

  searchMovies() {
    if (this.searchQuery.trim()) {
      this.moviesService.searchMovies(this.searchQuery).subscribe((response: any) => {
        console.log('Risultati della ricerca:', response.results);
        // Naviga a una pagina dei risultati della ricerca o aggiorna la vista corrente.
        this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
      });
    }
  }
}
