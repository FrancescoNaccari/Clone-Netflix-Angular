import { Component, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Subscription } from 'rxjs';
import { Movie } from 'src/app/interface/movie.interface';
import { FilterService, FilterType } from 'src/app/services/filter.service';
import { MoviesService } from 'src/app/services/movies.service';

interface MovieWithTrailer extends Movie {
  showTrailer?: boolean;
  trailerUrl?: string | SafeResourceUrl;
  genres?: string;
  genre_ids?: number[];
  ageRating?: string;
  ageRatingDescription?: string;
  director?: string;
  cast?: string;
  screenplay?: string;
  features?: string;
  runtime?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None, // Disabilita la scoping degli stili


})
export class HomeComponent implements OnInit, OnDestroy {
  movieCategories: { name: string; movies: MovieWithTrailer[] }[] = [];
  featuredMovie?: MovieWithTrailer;
  selectedMovie?: MovieWithTrailer;
  similarMovies: MovieWithTrailer[] = [];
  displayedSimilarMovies: MovieWithTrailer[] = [];
  showAllSimilarMovies = false;
  modalRef?: BsModalRef;
  private filterSubscription!: Subscription;
  private genresMap: { [key: number]: string } = {};

  @ViewChildren('carouselContainer') carouselContainers!: QueryList<ElementRef>;
  @ViewChild('movieModal') movieModal!: TemplateRef<any>;

  constructor(
    private moviesService: MoviesService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filterSubscription = this.filterService.filter$.subscribe((filter) => {
      this.loadMovies(filter);
    });
    // Carica i film inizialmente con il filtro 'all'
    this.loadMovies('all');
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  loadMovies(filter: FilterType): void {
    const type = filter === 'tvshows' ? 'tv' : 'movie';

    if (filter === 'new') {
      this.loadTrendingContent(type);
    } else {
      this.loadContentByType(type);
    }
  }

  private loadContentByType(type: 'movie' | 'tv'): void {
    const selectedGenreIds = this.getSelectedGenreIds(type);

    const genreObservables =
      type === 'movie'
        ? selectedGenreIds.map((id) => this.moviesService.getMoviesByGenre(id))
        : selectedGenreIds.map((id) => this.moviesService.getTVShowsByGenre(id));

    const getGenres =
      type === 'movie' ? this.moviesService.getMovieGenres() : this.moviesService.getTVGenres();

    getGenres.subscribe((genreData: any) => {
      const genres = genreData.genres;

      genres.forEach((genre: any) => {
        this.genresMap[genre.id] = genre.name;
      });

      forkJoin(genreObservables).subscribe((genreMoviesArrays: any[]) => {
        this.movieCategories = genreMoviesArrays
          .map((moviesData: any, index: number) => {
            const genreId = selectedGenreIds[index];
            const genreName = this.genresMap[genreId] || 'Sconosciuto';
            const movies =
              moviesData.results?.map((movie: any) => this.mapMovieData(movie)) || [];
            return { name: genreName, movies };
          })
          .filter((category) => category.movies.length > 0);

        this.featuredMovie = this.movieCategories[0]?.movies[0];
      });
    });
  }

  private loadTrendingContent(type: 'movie' | 'tv'): void {
    const trendingObservable =
      type === 'movie'
        ? this.moviesService.getTrendingMovies()
        : this.moviesService.getTrendingTVShows();

    trendingObservable.subscribe((data: any) => {
      const movies = data.results?.map((movie: any) => this.mapMovieData(movie)) || [];
      this.movieCategories = [{ name: 'Popolari', movies }];

      this.featuredMovie = movies[0];
    });
  }

  private mapMovieData(movie: any): MovieWithTrailer {
    return {
      ...movie,
      title: movie.title || movie.name,
      release_date: movie.release_date || movie.first_air_date,
      genres: this.getGenresString(movie.genre_ids ?? []),
    };
  }

  private getSelectedGenreIds(type: 'movie' | 'tv'): number[] {
    return type === 'movie'
      ? [28, 35, 18, 10751, 27] // Azione, Commedia, Dramma, Famiglia, Horror
      : [10759, 35, 18, 10751, 16]; // Azione & Avventura, Commedia, Dramma, Famiglia, Animazione
  }

  getGenresString(genreIds: number[]): string {
    return genreIds.map((id) => this.genresMap[id]).filter(Boolean).join(' • ');
  }

  scrollLeft(categoryName: string): void {
    const container = this.getCategoryCarousel(categoryName);
    if (container) {
      container.scrollBy({ left: -500, behavior: 'smooth' });
    }
  }

  scrollRight(categoryName: string): void {
    const container = this.getCategoryCarousel(categoryName);
    if (container) {
      container.scrollBy({ left: 500, behavior: 'smooth' });
    }
  }

  private getCategoryCarousel(categoryName: string): HTMLElement | null {
    const index = this.movieCategories.findIndex((category) => category.name === categoryName);
    return this.carouselContainers.toArray()[index]?.nativeElement ?? null;
  }

  openModal(movie: MovieWithTrailer): void {
    if (!movie.id) {
      console.error('Errore: il film selezionato non ha un ID valido.');
      return;
    }

    this.selectedMovie = {
      ...movie,
      runtime: 0,
      features: 'Non disponibile',
      ageRating: 'Tutti',
      ageRatingDescription: 'Adatto a tutti',
    };

    // Recupera i dettagli del film
    this.moviesService.getMovieDetails(movie.id).subscribe((details: any) => {
      this.selectedMovie = {
        ...this.selectedMovie!,
        runtime: details.runtime || 120,
        features: details.keywords?.keywords
          ? details.keywords.keywords.map((k: any) => k.name).join(', ')
          : 'Non disponibile',
        ageRating: details.adult ? '18+' : 'Tutti',
        ageRatingDescription: details.adult
          ? 'Visione riservata ai maggiori di 18 anni'
          : 'Adatto a tutti',
      };
    });

    // Recupera il cast e la crew
    this.moviesService.getMovieCredits(movie.id).subscribe((credits: any) => {
      const directors = credits.crew.filter((c: any) => c.job === 'Director');
      const screenwriters = credits.crew.filter((c: any) => c.job === 'Screenplay');
      const topCast = credits.cast.slice(0, 5);

      this.selectedMovie = {
        ...this.selectedMovie!,
        director: directors.map((d: any) => d.name).join(', ') || 'Non disponibile',
        screenplay: screenwriters.map((s: any) => s.name).join(', ') || 'Non disponibile',
        cast: topCast.map((c: any) => c.name).join(', ') || 'Non disponibile',
      };
    });

    // Recupera il trailer
    this.moviesService.getMovieVideos(movie.id).subscribe((videos: any) => {
      const trailer = videos.results.find(
        (t: any) => t.type === 'Trailer' && t.site === 'YouTube'
      );
      if (trailer) {
        this.selectedMovie!.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
        );
      }
    });

    // Recupera i film simili
    this.moviesService.getSimilarMovies(movie.id).subscribe((response: any) => {
      const filteredSimilarMovies = response.results.filter((item: any) => item.poster_path);

      this.similarMovies = filteredSimilarMovies.map((item: any) => ({
        id: item.id,
        title: item.title || item.name || 'Titolo non disponibile',
        poster_path: item.poster_path,
        overview: item.overview || 'Descrizione non disponibile',
        release_date: item.release_date || item.first_air_date || 'ND',
        runtime: item.runtime || 'ND',
        ageRating: item.ageRating || 'ND',
        genres: this.getGenresString(item.genre_ids || []),
      }));

      this.updateDisplayedSimilarMovies();
    });

    this.modalRef = this.modalService.show(this.movieModal);
  }

  updateDisplayedSimilarMovies(): void {
    this.displayedSimilarMovies = this.showAllSimilarMovies
      ? this.similarMovies
      : this.similarMovies.slice(0, 9);
  }

  toggleShowAllSimilarMovies(): void {
    this.showAllSimilarMovies = !this.showAllSimilarMovies;
    this.updateDisplayedSimilarMovies();
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.selectedMovie = undefined;
  }
}
