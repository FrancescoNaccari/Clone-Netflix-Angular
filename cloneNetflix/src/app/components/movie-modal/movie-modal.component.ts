import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MovieWithTrailer } from 'src/app/interface/movie-with-trailer.interface';
import { MoviesService } from 'src/app/services/movies.service';

@Component({
  selector: 'app-movie-modal',
  templateUrl: './movie-modal.component.html',
  styleUrls: ['./movie-modal.component.scss']
})
export class MovieModalComponent implements OnInit {
  @Input() movie!: MovieWithTrailer;
  @Output() close = new EventEmitter<void>();
  selectedMovie?: MovieWithTrailer;
  similarMovies: MovieWithTrailer[] = [];
  displayedSimilarMovies: MovieWithTrailer[] = [];
  showAllSimilarMovies = false;

  constructor(
    private moviesService: MoviesService,
    private sanitizer: DomSanitizer,
    public modal:NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  loadMovieDetails(): void {
    if (!this.movie.id) {
      console.error('Errore: il film selezionato non ha un ID valido.');
      return;
    }

    this.selectedMovie = {
      ...this.movie,
      runtime: 0,
      features: 'Non disponibile',
      ageRating: 'Tutti',
      ageRatingDescription: 'Adatto a tutti',
    };

    // Recupera i dettagli del film
    this.moviesService.getMovieDetails(this.movie.id).subscribe((details: any) => {
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
    this.moviesService.getMovieCredits(this.movie.id).subscribe((credits: any) => {
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
    this.moviesService.getMovieVideos(this.movie.id).subscribe((videos: any) => {
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
    this.moviesService.getSimilarMovies(this.movie.id).subscribe((response: any) => {
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
  }

  getGenresString(genreIds: number[]): string {
    // Implementa questo metodo o importalo da un servizio condiviso
    return '';
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
    this.close.emit();
  }
  openSimilarMovie(movie: MovieWithTrailer): void {
    this.movie = movie;
    this.loadMovieDetails();
  }
  
}
