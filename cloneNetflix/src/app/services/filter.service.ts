import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export type FilterType = 'all' | 'movies' | 'tvshows' | 'new';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private filterSubject = new BehaviorSubject<FilterType>('all');
  filter$ = this.filterSubject.asObservable();

  setFilter(filter: FilterType) {
    this.filterSubject.next(filter);
  }
}
