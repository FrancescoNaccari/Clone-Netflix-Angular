import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = environment.apiMoveUrl;
  private bearerToken = environment.tmdbBearerToken;

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('Errore API:', error);
    return throwError(() => new Error('Errore nella richiesta API. Riprova più tardi.'));
  }

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.bearerToken}`,
    });
  }

  getPopularMovies(page: number = 1) {
    return this.http
      .get(`${this.apiUrl}/movie/popular?page=${page}&language=it-IT`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getPopularTVShows(page: number = 1) {
    return this.http.get(
      `${this.apiUrl}/tv/popular?page=${page}&language=it-IT`,
      { headers: this.getHeaders() }
    );
  }

  getTrendingMovies() {
    return this.http.get(
      `${this.apiUrl}/trending/all/day`,
      { headers: this.getHeaders() }
    );
  }

  getGenres() {
    return this.http.get(
      `${this.apiUrl}/genre/movie/list`,
      { headers: this.getHeaders() }
    );
  }

  getMoviesByGenre(genreId: number) {
    return this.http.get(
      `${this.apiUrl}/discover/movie?with_genres=${genreId}&language=it-IT`,
      { headers: this.getHeaders() }
    );
  }

  getMovieVideos(movieId: number) {
    return this.http.get(`${this.apiUrl}/movie/${movieId}/videos`, {
      headers: this.getHeaders(),
    });
  }

  getTVShowVideos(tvId: number) {
    return this.http.get(`${this.apiUrl}/tv/${tvId}/videos`, {
      headers: this.getHeaders(),
    });
  }

  getMovieReleaseDates(movieId: number) {
    return this.http
      .get(`${this.apiUrl}/movie/${movieId}/release_dates`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getTVShowDetails(tvId: number) {
    return this.http
      .get(`${this.apiUrl}/tv/${tvId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
  getSimilarMovies(movieId: number) {
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}/similar`, {
      headers: this.getHeaders(),
      params: {
        language: 'it-IT', // Lingua italiana
      },
    }).pipe(catchError(this.handleError));
  }
  getMovieDetails(movieId: number) {
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}`, {
      headers: this.getHeaders(),
      params: { language: 'it-IT' },
    });
  }
  
  getMovieCredits(movieId: number) {
    return this.http.get<any>(`${this.apiUrl}/movie/${movieId}/credits`, {
      headers: this.getHeaders(),
    });
  }



  // Metodo per ottenere i generi dei film
  getMovieGenres() {
    return this.http.get(`${this.apiUrl}/genre/movie/list`, {
      headers: this.getHeaders(),
    });
  }

  // Metodo per ottenere i generi delle serie TV
  getTVGenres() {
    return this.http.get(`${this.apiUrl}/genre/tv/list`, {
      headers: this.getHeaders(),
    });
  }



  // Metodo per ottenere le serie TV per genere
  getTVShowsByGenre(genreId: number) {
    return this.http.get(`${this.apiUrl}/discover/tv?with_genres=${genreId}&language=it-IT`, {
      headers: this.getHeaders(),
    });
  }
   // Metodo per ottenere le serie TV di tendenza
   getTrendingTVShows() {
    return this.http.get(`${this.apiUrl}/trending/tv/day?language=it-IT`, {
      headers: this.getHeaders(),
    });
  }
  searchMovies(query: string) {
    return this.http.get(`${this.apiUrl}/search/movie`, {
      headers: this.getHeaders(),
      params: {
        query: query,
        language: 'it-IT',
      },
    });
  }
  
}
