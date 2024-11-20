import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Movie } from 'src/app/interface/movie.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  heroMovie: any = null;
  categories: { title: string; movies: any[] }[] = [];
  isLoading = true;

  @ViewChildren('carousel') carousels!: QueryList<ElementRef>;

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadHeroMovie();
    this.loadCategories();
  }

  loadHeroMovie() {
    this.moviesService.getPopularMovies().subscribe((response: any) => {
      const movies = response.results;
      this.heroMovie = movies[Math.floor(Math.random() * movies.length)];
    });
  }

  loadCategories() {
    const categoryRequests = [
      { title: 'Popular on Netflix', fetch: this.moviesService.getPopularMovies() },
      { title: 'Top Rated', fetch: this.moviesService.getMoviesByGenre(18) },
      { title: 'Action Movies', fetch: this.moviesService.getMoviesByGenre(28) }
    ];

    categoryRequests.forEach((categoryRequest, index) => {
      categoryRequest.fetch.subscribe((response: any) => {
        this.categories.push({
          title: categoryRequest.title,
          movies: response.results,
        });
        if (index === categoryRequests.length - 1) this.isLoading = false;
      });
    });
  }

  scrollLeft(index: number) {
    const carousel = document.querySelector(`#carousel-${index}`) as HTMLElement;

    if (!carousel) {
      console.error(`Carosello con ID carousel-${index} non trovato.`);
      return;
    }

    carousel.scrollLeft -= 300; // Scorre a sinistra di 300px
  }

  scrollRight(index: number) {
    const carousel = document.querySelector(`#carousel-${index}`) as HTMLElement;

    if (!carousel) {
      console.error(`Carosello con ID carousel-${index} non trovato.`);
      return;
    }

    carousel.scrollLeft += 300; // Scorre a destra di 300px
  }

  selectMovie(movie: any) {
    this.heroMovie = movie; // Aggiorna la hero section con il film selezionato
  }
}