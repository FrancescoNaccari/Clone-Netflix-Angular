import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private baseUrl = environment.apiMoveUrl;

  constructor(private http: HttpClient) { }

  getPopularMovies(): Observable<any> {
    const url = `${this.baseUrl}/movie/popular`;
    const params = new HttpParams().set('api_key', environment.tmdbapiKey);
    return this.http.get(url, { params });
  }

  searchMovies(query: string): Observable<any> {
    const url = `${this.baseUrl}/search/movie`;
    const params = new HttpParams()
      .set('api_key', environment.tmdbapiKey)
      .set('query', query);
    return this.http.get(url, { params });
  }

  getMovieDetails(id: number): Observable<any> {
    const url = `${this.baseUrl}/movie/${id}`;
    const params = new HttpParams().set('api_key', environment.tmdbapiKey);
    return this.http.get(url, { params });
  }
}
