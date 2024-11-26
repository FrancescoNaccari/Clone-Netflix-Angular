import { SafeResourceUrl } from "@angular/platform-browser";
import { Movie } from "./movie.interface";

export interface MovieWithTrailer extends Movie {
    showTrailer?: boolean;
    trailerUrl?: string | SafeResourceUrl;
    genres?: string;
    genre_ids?: number[];
    ageRating?: string;
    ageRatingDescription?: string;
    director?: string;
    cast?: string;
    screenplay?: string;
    features?: string;
    runtime?: number;
}
