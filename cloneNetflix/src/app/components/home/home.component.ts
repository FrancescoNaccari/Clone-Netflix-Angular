import { Component, OnInit } from '@angular/core';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent  implements OnInit {
  popularMovies: any[] = [];
  popularTVShows: any[] = [];
  bannerImage: string = '';
  bannerTitle: string = '';
  bannerOverview: string = '';
  isLoading: boolean = true;
  currentPage: number = 1;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadMoviesAndTVShows();
  }

  // Carica film, serie e banner
  loadMoviesAndTVShows(): void {
    this.isLoading = true;

    this.moviesService.getPopularMovies(this.currentPage).subscribe((data: any) => {
      this.popularMovies = data.results;
      this.updateBanner(data.results[0]); // Imposta il primo film come banner
      this.isLoading = false;
    });

    this.moviesService.getPopularTVShows(this.currentPage).subscribe((data: any) => {
      this.popularTVShows = data.results;
      this.isLoading = false;
    });
  }

  // Aggiorna il contenuto del banner
  updateBanner(movie: any): void {
    this.bannerImage = movie.backdrop_path;
    this.bannerTitle = movie.title;
    this.bannerOverview = movie.overview;
  }

  // Cambia pagina
  changePage(direction: number): void {
    this.currentPage += direction;
    this.loadMoviesAndTVShows();
  }
  getBannerBackground(): string {
    return `url(https://image.tmdb.org/t/p/w1280/${this.bannerImage})`;
  }
  
}