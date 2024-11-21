import { Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Movie } from 'src/app/interface/movie.interface';
import { MoviesService } from 'src/app/services/movies.service';
interface MovieWithTrailer extends Movie {
  showTrailer?: boolean;
  trailerUrl?: string | SafeResourceUrl;}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  popularMovies: MovieWithTrailer[] = [];

  constructor(private moviesService: MoviesService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  loadPopularMovies(): void {
    this.moviesService.getPopularMovies().subscribe((response: any) => {
      this.popularMovies = response.results;
    });
  }

  playTrailer(movie: MovieWithTrailer): void {
    this.moviesService.getMovieTrailers(movie.id).subscribe((response: any) => {
      if (response.results.length > 0) {
        const trailer = response.results.find((t: any) => t.type === 'Trailer' && t.site === 'YouTube');
        if (trailer) {
          movie.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1`) as string;
          movie.showTrailer = true;
        }
      }
    });
  }

  stopTrailer(movie: MovieWithTrailer): void {
    movie.showTrailer = false;
    movie.trailerUrl = '';
  }
}