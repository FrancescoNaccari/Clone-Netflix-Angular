package it.cloneNetflixBackEnd.service;

import it.cloneNetflixBackEnd.model.Movie;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OmdbService {

    private final RestTemplate restTemplate;

    @Value("${omdb.api.url}")
    private String omdbApiUrl;

    @Value("${omdb.api.key}")
    private String apiKey;

    public OmdbService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Movie fetchMovieByTitle(String title) {
        String url = omdbApiUrl + "?t=" + title + "&apikey=" + apiKey;
        return restTemplate.getForObject(url, Movie.class);
    }
}