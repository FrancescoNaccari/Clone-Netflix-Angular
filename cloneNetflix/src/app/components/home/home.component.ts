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
  popularMovies: MovieWithTrailer[] = [];
  featuredMovie: MovieWithTrailer | undefined;
  movieCategories: { name: string; movies: MovieWithTrailer[] }[] = [];
  private trailerTimeout: any;
  @ViewChildren('carouselContainer') carouselContainers!: QueryList<ElementRef>;
  modalRef?: BsModalRef;
  selectedMovie?: MovieWithTrailer;
  @ViewChild('movieModal') movieModal!: TemplateRef<any>;
  similarMovies: MovieWithTrailer[] = [];
  displayedSimilarMovies: MovieWithTrailer[] = [];
  showAllSimilarMovies: boolean = false;
  private filterSubscription!: Subscription;

  constructor(
    private moviesService: MoviesService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    // Iscriviti all'Observable del filtro
    this.filterSubscription = this.filterService.filter$.subscribe((filter) => {
      this.loadMovies(filter);
    });
    // Carica i film inizialmente con il filtro 'all'
    this.loadMovies('all');
  }

  ngOnDestroy(): void {
    // Annulla la sottoscrizione al filtro per evitare memory leaks
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    // Ferma eventuali trailer in riproduzione
    this.popularMovies.forEach((movie) => {
      movie.showTrailer = false;
      movie.trailerUrl = '';
    });
  }

  loadMovies(filter: FilterType): void {
    if (filter === 'all' || filter === 'new') {
      // Selezioniamo alcuni generi per la home page
      const selectedGenreIds = [28, 35, 18, 10751, 27]; // Azione, Commedia, Dramma, Famiglia, Horror

      // Recuperiamo i film per ogni genere
      const genreObservables = selectedGenreIds.map((genreId) =>
        this.moviesService.getMoviesByGenre(genreId)
      );

      // Recuperiamo i nomi dei generi
      this.moviesService.getMovieGenres().subscribe((genreData: any) => {
        const genres = genreData.genres;

        forkJoin(genreObservables).subscribe((genreMoviesArrays: any[]) => {
          this.movieCategories = genreMoviesArrays.map((moviesData: any, index: number) => {
            const genreId = selectedGenreIds[index];
            const genreName = genres.find((g: any) => g.id === genreId)?.name || 'Sconosciuto';
            const movies = moviesData.results.map((movie: any) => ({
              ...movie,
              title: movie.title || movie.name,
              release_date: movie.release_date || movie.first_air_date,
              genres: this.getGenresString(movie.genre_ids ?? []),
            }));
            return { name: genreName, movies };
          });

          // Impostiamo il primo film come featured
          this.featuredMovie = this.movieCategories[0].movies[0];
        });
      });
    } else if (filter === 'movies') {
      // Simile al caso 'all', ma focalizzato sui film
      this.loadMoviesByType('movie');
    } else if (filter === 'tvshows') {
      // Carichiamo le serie TV per genere
      this.loadMoviesByType('tv');
    }
  }

  loadMoviesByType(type: 'movie' | 'tv'): void {
    const selectedGenreIds = [28, 35, 18, 10751, 27]; // Generi selezionati
    const genreObservables =
      type === 'movie'
        ? selectedGenreIds.map((genreId) => this.moviesService.getMoviesByGenre(genreId))
        : selectedGenreIds.map((genreId) => this.moviesService.getTVShowsByGenre(genreId));

    const getGenres =
      type === 'movie' ? this.moviesService.getMovieGenres() : this.moviesService.getTVGenres();

    getGenres.subscribe((genreData: any) => {
      const genres = genreData.genres;

      forkJoin(genreObservables).subscribe((genreMoviesArrays: any[]) => {
        this.movieCategories = genreMoviesArrays.map((moviesData: any, index: number) => {
          const genreId = selectedGenreIds[index];
          const genreName = genres.find((g: any) => g.id === genreId)?.name || 'Sconosciuto';
          const movies = moviesData.results.map((movie: any) => ({
            ...movie,
            title: movie.title || movie.name,
            release_date: movie.release_date || movie.first_air_date,
            genres: this.getGenresString(movie.genre_ids ?? []),
          }));
          return { name: genreName, movies };
        });

        // Impostiamo il primo film come featured
        this.featuredMovie = this.movieCategories[0].movies[0];
      });
    });
  }

  private processMovies(movies: any[]): void {
    const validMovies = movies.filter(
      (movie: any) => movie.poster_path && (movie.title || movie.name)
    );
    this.popularMovies = validMovies.map((movie: any) => ({
      ...movie,
      title: movie.title || movie.name,
      release_date: movie.release_date || movie.first_air_date,
      genres: this.getGenresString(movie.genre_ids ?? []),
    }));

    this.featuredMovie = this.popularMovies[0];

    this.movieCategories = [
      { name: 'Categorie', movies: this.popularMovies },
    ];
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
    const index = this.movieCategories.findIndex(
      (category) => category.name === categoryName
    );
    return this.carouselContainers.toArray()[index]?.nativeElement ?? null;
  }

  getGenresString(genreIds: number[]): string {
    const genreMap: { [key: number]: string } = {
      28: 'Azione',
      12: 'Avventura',
      16: 'Animazione',
      35: 'Commedia',
      80: 'Crime',
      99: 'Documentario',
      18: 'Dramma',
      10751: 'Famiglia',
      14: 'Fantasy',
      36: 'Storia',
      27: 'Horror',
      10402: 'Musica',
      9648: 'Mistero',
      10749: 'Romantico',
      878: 'Fantascienza',
      10770: 'Film TV',
      53: 'Thriller',
      10752: 'Guerra',
      37: 'Western',
    };

    return genreIds
      .map((id) => genreMap[id])
      .filter(Boolean)
      .join(' • ');
  }

  chunkArray(array: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  playTrailer(movie: MovieWithTrailer): void {
    this.moviesService.getMovieVideos(movie.id).subscribe((videos: any) => {
      if (videos.results && videos.results.length > 0) {
        const officialTrailer = videos.results.find(
          (t: any) =>
            t.type === 'Trailer' &&
            t.site === 'YouTube' &&
            t.official === true
        );

        const fallbackTrailer = videos.results.find(
          (t: any) => t.type === 'Trailer' && t.site === 'YouTube'
        );

        const selectedTrailer = officialTrailer || fallbackTrailer;

        if (selectedTrailer) {
          movie.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${selectedTrailer.key}`
          );
          movie.showTrailer = true;
        } else {
          console.warn(`Nessun trailer valido trovato per: ${movie.title}`);
          movie.trailerUrl = undefined;
          movie.showTrailer = false;
        }
      } else {
        console.warn(`Nessun video trovato per: ${movie.title}`);
        movie.trailerUrl = undefined;
        movie.showTrailer = false;
      }
    });
  }

  stopTrailer(movie: MovieWithTrailer): void {
    clearTimeout(this.trailerTimeout);
    movie.showTrailer = false;
    movie.trailerUrl = '';
  }

  openModal(movie: MovieWithTrailer): void {
    if (!movie.id) {
      console.error('Errore: il film selezionato non ha un ID valido.');
      return;
    }

    this.selectedMovie = {
      ...movie,
      id: movie.id,
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
      const directors = credits.crew.filter(
        (c: any) => c.job === 'Director'
      );
      const screenwriters = credits.crew.filter(
        (c: any) => c.job === 'Screenplay'
      );
      const topCast = credits.cast.slice(0, 5);

      this.selectedMovie = {
        ...this.selectedMovie!,
        director:
          directors.map((d: any) => d.name).join(', ') || 'Non disponibile',
        screenplay:
          screenwriters.map((s: any) => s.name).join(', ') ||
          'Non disponibile',
        cast:
          topCast.map((c: any) => c.name).join(', ') || 'Non disponibile',
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
      const filteredSimilarMovies = response.results.filter(
        (item: any) => item.poster_path
      );

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
