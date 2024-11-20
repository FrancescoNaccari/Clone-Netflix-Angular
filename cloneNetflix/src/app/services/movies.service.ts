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

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.bearerToken}`,
    });
  }

  getPopularMovies(page: number = 1) {
    return this.http.get(
      `${this.apiUrl}/movie/popular?page=${page}&language=it-IT`,
      { headers: this.getHeaders() }
    );
  }

  getPopularTVShows(page: number = 1) {
    return this.http.get(
      `${this.apiUrl}/tv/popular?page=${page}&language=it-IT`,
      { headers: this.getHeaders() }
    );
  }
}
