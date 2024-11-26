import { Component, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Subscription } from 'rxjs';
import { MovieWithTrailer } from 'src/app/interface/movie-with-trailer.interface';
import { Movie } from 'src/app/interface/movie.interface';
import { FilterService, FilterType } from 'src/app/services/filter.service';
import { MoviesService } from 'src/app/services/movies.service';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None, // Disabilita la scoping degli stili


})
export class HomeComponent implements OnInit, OnDestroy {
  movieCategories: { name: string; movies: MovieWithTrailer[] }[] = [];
  featuredMovie?: MovieWithTrailer;
  similarMovies: MovieWithTrailer[] = [];
  displayedSimilarMovies: MovieWithTrailer[] = [];
  showAllSimilarMovies = false;
  modalRef?: BsModalRef;
  private filterSubscription!: Subscription;
  private genresMap: { [key: number]: string } = {};

  selectedMovie?: MovieWithTrailer;
  isModalOpen = false;

  @ViewChildren('carouselContainer') carouselContainers!: QueryList<ElementRef>;
  @ViewChild('movieModal') movieModal!: TemplateRef<any>;

  constructor(
    private moviesService: MoviesService,
    private filterService: FilterService,
    private modalService:NgbModal
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
    // this.selectedMovie = movie;
    // this.isModalOpen = true;
    let modale=this.modalService.open(MovieModalComponent,{size:'lg',centered:true})
    modale.componentInstance.movie=movie;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedMovie = undefined;
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

}
