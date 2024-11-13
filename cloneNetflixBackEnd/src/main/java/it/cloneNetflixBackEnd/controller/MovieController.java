package it.cloneNetflixBackEnd.controller;

import it.cloneNetflixBackEnd.dto.OmdbMovieDto;
import it.cloneNetflixBackEnd.model.Movie;
import it.cloneNetflixBackEnd.service.MovieService;
import it.cloneNetflixBackEnd.service.OmdbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    @Autowired
    private MovieService movieService;

    @Autowired
    private OmdbService omdbService;

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<OmdbMovieDto> getMoviesBySearch(@RequestParam String searchQuery, @RequestParam(defaultValue = "1") int page) {
        return movieService.fetchMoviesBySearch(searchQuery, page);
    }

    @GetMapping("/title")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public Movie getMovieByTitle(@RequestParam String title) {
        return movieService.fetchMovieByTitle(title);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<Movie> getAllMovies(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return movieService.getAllMovies(page, size).getContent();
    }


    @GetMapping("/genre")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public List<Movie> getMoviesByGenre(@RequestParam String genre, @RequestParam(defaultValue = "1") int page) {
        return movieService.fetchMoviesByGenre(genre, page);
    }

}
