package it.cloneNetflixBackEnd.security;

import it.cloneNetflixBackEnd.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public class ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMovieId(Long movieId);
}
