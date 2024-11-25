import { Component, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { Movie } from 'src/app/interface/movie.interface';
import { MoviesService } from 'src/app/services/movies.service';

interface MovieWithTrailer extends Movie {
  showTrailer?: boolean;
  trailerUrl?: string | SafeResourceUrl;
  genres?: string;
  ageRating?: string;
  number_of_seasons?: number;
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

  constructor(
    private moviesService: MoviesService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  ngOnDestroy(): void {
    // Stop any trailers playing when the component is destroyed
    this.popularMovies.forEach((movie) => {
      movie.showTrailer = false;
      movie.trailerUrl = '';
    });
  }

  loadMovies(): void {
    forkJoin({
      movies: this.moviesService.getPopularMovies(),
      tvShows: this.moviesService.getPopularTVShows(),
    }).subscribe(({ movies, tvShows }: any) => {
      const combinedResults = [...movies.results, ...tvShows.results];
  
      // Filtra i film validi e crea un array di backup
      const validMovies = combinedResults.filter((movie: any) => movie.poster_path && movie.title);
      const backupMovies = combinedResults.filter((movie: any) => !movie.poster_path || !movie.title);
  
      // Sostituisci i film non validi con i backup
      const normalizedMovies = combinedResults.map((movie: any) => {
        if (movie.poster_path && movie.title) {
          return {
            ...movie,
            genres: this.getGenresString(movie.genre_ids ?? []),
          };
        } else {
          // Prendi un film di backup valido
          const backupMovie = validMovies.pop();
          return backupMovie
            ? { ...backupMovie, genres: this.getGenresString(backupMovie.genre_ids ?? []) }
            : { title: 'Non disponibile', poster_path: null };
        }
      });
  
      // Imposta i film caricati
      this.popularMovies = normalizedMovies;
  
      this.featuredMovie = this.popularMovies[0];
  
      this.movieCategories = [
        { name: 'Novità su Netflix', movies: this.popularMovies.slice(0, 12) },
        { name: 'Sport e fitness', movies: this.popularMovies.slice(12, 24) },
        { name: 'I più cercati', movies: this.popularMovies.slice(24, 36) },
      ];
    });
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

    return genreIds.map((id) => genreMap[id]).filter(Boolean).join(' • ');
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
      console.log('Risposta video API:', videos); // Debug per verificare i dati ricevuti
  
      if (videos.results && videos.results.length > 0) {
        // Trova un trailer ufficiale se disponibile
        const officialTrailer = videos.results.find(
          (t: any) =>
            t.type === 'Trailer' &&
            t.site === 'YouTube' &&
            t.official === true
        );
  
        // Se non ci sono trailer ufficiali, trova il primo trailer generico
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
          console.warn(`Nessun trailer valido trovato per il film: ${movie.title}`);
          movie.trailerUrl = undefined;
          movie.showTrailer = false;
        }
      } else {
        console.warn(`Nessun video trovato per il film: ${movie.title}`);
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
    this.selectedMovie = movie;
    this.playTrailer(movie);
    this.modalRef = this.modalService.show(this.movieModal); // Usa il riferimento del template
  }
  
  closeModal(): void {
    this.modalRef?.hide();
    this.selectedMovie = undefined;
  }
}
