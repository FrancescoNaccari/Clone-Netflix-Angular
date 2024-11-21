import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Movie } from 'src/app/interface/movie.interface';
import { MoviesService } from 'src/app/services/movies.service';
interface MovieWithTrailer extends Movie {
  showTrailer?: boolean;
  trailerUrl?: string | SafeResourceUrl;
  genres?: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  popularMovies: MovieWithTrailer[] = [];
  private trailerTimeout: any;

  constructor(private moviesService: MoviesService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  ngOnDestroy(): void {
    // Clean up movie trailers when component is destroyed
    this.popularMovies.forEach(movie => {
      movie.showTrailer = false;
      movie.trailerUrl = '';
    });
  }

  loadPopularMovies(): void {
    this.moviesService.getPopularMovies().subscribe((response: any) => {
      this.popularMovies = response.results.map((movie: Movie) => {
        return {
          ...movie,
          genres: this.getGenresString(movie.genre_ids ?? [])
        };
      });
    });
  }

  getGenresString(genreIds: number[]): string {
    const genreMap: { [key: number]: string } = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };
    return genreIds.map(id => genreMap[id]).filter(Boolean).join(', ');
  }

  playTrailer(movie: MovieWithTrailer): void {
    this.trailerTimeout = setTimeout(() => {
      this.moviesService.getMovieVideos(movie.id).subscribe((response: any) => {
        if (response.results.length > 0) {
          const trailer = response.results.find((t: any) => t.type === 'Trailer' && t.site === 'YouTube');
          if (trailer) {
            movie.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
            );
            movie.showTrailer = true;
          }
        }
      });
    }, 300); // Delay to reduce API calls
  }
  
  stopTrailer(movie: MovieWithTrailer): void {
    clearTimeout(this.trailerTimeout);
    movie.showTrailer = false;
    movie.trailerUrl = '';
  }
}