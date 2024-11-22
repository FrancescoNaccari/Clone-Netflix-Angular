import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  popularMovies: MovieWithTrailer[] = [];
  featuredMovie: MovieWithTrailer | undefined;
  movieCategories: { name: string, movies: MovieWithTrailer[] }[] = [];
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
    forkJoin({
      movies: this.moviesService.getPopularMovies(),
      tvShows: this.moviesService.getPopularTVShows(),
    }).subscribe(({ movies, tvShows }: any) => {
      const combinedResults = [...movies.results, ...tvShows.results];
      this.popularMovies = combinedResults.map((item: any) => {
        return {
          ...item,
          genres: this.getGenresString(item.genre_ids ?? []),
          number_of_seasons: item.number_of_seasons,
        };
      });

      // Setting the featured movie for the cover
      this.featuredMovie = this.popularMovies[0];

      // Categorizing movies into sections
      this.movieCategories = [
        { name: 'Novità su Netflix', movies: this.popularMovies.slice(0, 10) },
        { name: 'Sport e fitness', movies: this.popularMovies.slice(10, 20) },
        { name: 'I più cercati', movies: this.popularMovies.slice(20, 30) },
      ];
    });
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
  
}