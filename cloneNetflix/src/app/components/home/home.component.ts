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
        const movies = response.results;
        // Cloniamo gli ultimi 5 e i primi 5 film
        this.categories.push({
          title: categoryRequest.title,
          movies: [...movies.slice(-20), ...movies, ...movies.slice(0, 20)],
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

    // Scorri a sinistra
    carousel.scrollLeft -= 300;

    // Se siamo arrivati all'inizio, riposizioniamo al "contenuto reale" finale
    if (carousel.scrollLeft <= 0) {
      carousel.scrollLeft = carousel.scrollWidth / 3; // Riposiziona al contenuto reale
    }
  }

  scrollRight(index: number) {
    const carousel = document.querySelector(`#carousel-${index}`) as HTMLElement;

    if (!carousel) {
      console.error(`Carosello con ID carousel-${index} non trovato.`);
      return;
    }

    // Scorri a destra
    carousel.scrollLeft += 300;

    // Se siamo arrivati alla fine, riposizioniamo al "contenuto reale" iniziale
    if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth) {
      carousel.scrollLeft = carousel.scrollWidth / 3; // Riposiziona al contenuto reale
    }
  }

  selectMovie(movie: any) {
    this.heroMovie = movie; // Aggiorna la Hero Section con il film selezionato
  }
}