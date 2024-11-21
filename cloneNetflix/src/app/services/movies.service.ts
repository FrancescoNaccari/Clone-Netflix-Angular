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

  getGenres() {
    return this.http.get(
      `${this.apiUrl}/genre/movie/list?language=it-IT`,
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
    return this.http.get(`${this.apiUrl}/movie/${movieId}/videos?language=it-IT`, {
      headers: this.getHeaders(),
    });
  }
}