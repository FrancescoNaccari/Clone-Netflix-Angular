package it.cloneNetflixBackEnd.service;

import it.cloneNetflixBackEnd.dto.OmdbMovieDto;
import it.cloneNetflixBackEnd.dto.OmdbSearchResponse;
import it.cloneNetflixBackEnd.model.Movie;
import it.cloneNetflixBackEnd.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Service

public class MovieService {
    @Value("${omdb.api.url}")
    private String omdbApiUrl;

    @Value("${omdb.api.key}")
    private String apiKey;

    @Autowired
    private MovieRepository movieRepository;

    private final RestTemplate restTemplate = new RestTemplate();




    public Movie fetchMovieByTitle(String title) {
        Optional<Movie> cachedMovie = movieRepository.findByTitle(title);
        if (cachedMovie.isPresent()) {
            return cachedMovie.get();
        }

        String url = omdbApiUrl + "?t=" + title + "&apikey=" + apiKey;

        Movie movie = restTemplate.getForObject(url, Movie.class);

        if (movie != null && movie.getTitle() != null) {
            movieRepository.save(movie);
        }

        return movie;
    }

    public List<OmdbMovieDto> fetchMoviesBySearch(String searchQuery, int page) {
        String url = UriComponentsBuilder.fromHttpUrl(omdbApiUrl)
                .queryParam("s", searchQuery)
                .queryParam("page", page)
                .queryParam("apikey", apiKey)
                .toUriString();

        OmdbSearchResponse response = restTemplate.getForObject(url, OmdbSearchResponse.class);

        if (response != null && "True".equalsIgnoreCase(response.getResponse())) {
            List<OmdbMovieDto> movies = response.getSearch();

            // Per ogni film, recupera ulteriori dettagli utilizzando l'imdbID
            movies.forEach(movie -> {
                String detailUrl = UriComponentsBuilder.fromHttpUrl(omdbApiUrl)
                        .queryParam("i", movie.getImdbID())
                        .queryParam("apikey", apiKey)
                        .toUriString();

                OmdbMovieDto detailedMovie = restTemplate.getForObject(detailUrl, OmdbMovieDto.class);

                if (detailedMovie != null) {
                    // Aggiorna i campi con i dettagli
                    movie.setGenre(detailedMovie.getGenre());
                    movie.setDirector(detailedMovie.getDirector());
                    movie.setPlot(detailedMovie.getPlot());
                }
            });

            return movies;
        } else {
            return List.of();
        }
    }

    public Page<Movie> getAllMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return movieRepository.findAll(pageable);
    }

    public List<Movie> fetchMoviesByGenre(String genre, int page) {
        String url = omdbApiUrl + "?genre=" + genre + "&page=" + page + "&apikey=" + apiKey;
        ResponseEntity<OmdbSearchResponse> response = restTemplate.exchange(url, HttpMethod.GET, null, OmdbSearchResponse.class);

        if (response.getBody() != null && response.getBody().getSearch() != null) {
            return response.getBody().getSearch().stream()
                    .map(this::mapDtoToMovie)
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    private Movie mapDtoToMovie(OmdbMovieDto dto) {
        Movie movie = new Movie();
        movie.setTitle(dto.getTitle());
        movie.setYear(dto.getYear());
        movie.setGenre(dto.getGenre());
        movie.setDirector(dto.getDirector());
        movie.setPlot(dto.getPlot());
        movie.setPoster(dto.getPoster());
        return movie;
    }
}
