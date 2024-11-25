export interface Movie {
  id: number;
  title?: string;
  name?: string; 
  overview: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string; 
  genre_ids?: number[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
