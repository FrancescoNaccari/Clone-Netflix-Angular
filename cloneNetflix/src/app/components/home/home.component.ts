import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { Movie } from 'src/app/interface/movie.interface';
import { MoviesService } from 'src/app/services/movies.service';
interface MovieWithTrailer extends Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  showTrailer?: boolean;
  trailerUrl?: SafeResourceUrl | string;
  genres?: string;
  ageRating?: string;
  number_of_seasons?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredMovie: MovieWithTrailer | undefined;
  movieCategories: { name: string; movies: MovieWithTrailer[] }[] = [];
  private trailerTimeout: any;

  constructor(private moviesService: MoviesService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  ngOnDestroy(): void {
    clearTimeout(this.trailerTimeout);
  }

  loadMovies(): void {
    forkJoin({
      movies: this.moviesService.getPopularMovies(),
      tvShows: this.moviesService.getPopularTVShows()
    }).subscribe(({ movies, tvShows }: any) => {
      const combined = [...movies.results, ...tvShows.results];
      const moviesWithGenres = combined.map((movie: any) => ({
        ...movie,
        genres: this.getGenres(movie.genre_ids)
      }));
      this.featuredMovie = moviesWithGenres[0];
      this.movieCategories = [
        { name: 'Novità su Netflix', movies: moviesWithGenres.slice(0, 10) },
        { name: 'Sport e Fitness', movies: moviesWithGenres.slice(10, 20) },
        { name: 'I più cercati', movies: moviesWithGenres.slice(20, 30) }
      ];
    });
  }
  
  getGenres(genreIds: number[]): string {
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
    
    return genreIds.map(id => genreMap[id]).filter(Boolean).join(' • ');
  }

  playTrailer(movie: MovieWithTrailer): void {
    this.trailerTimeout = setTimeout(() => {
      this.moviesService.getMovieVideos(movie.id).subscribe((videos: any) => {
        if (videos.results.length > 0) {
          const trailer = videos.results.find(
            (t: any) => t.type === 'Trailer' && t.site === 'YouTube'
          );
          if (trailer) {
            movie.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
            );
            movie.showTrailer = true;
          }
        }
      });
    }, 300);
  }
  stopTrailer(movie: MovieWithTrailer): void {
    clearTimeout(this.trailerTimeout);
    movie.showTrailer = false;
    movie.trailerUrl = '';
  }

  scrollCarousel(categoryName: string, direction: 'prev' | 'next'): void {
    const carousel = document.getElementById('carousel-' + categoryName);
    if (carousel) {
      const scrollAmount = 300;
      carousel.scrollLeft += direction === 'next' ? scrollAmount : -scrollAmount;
    }
  }
}