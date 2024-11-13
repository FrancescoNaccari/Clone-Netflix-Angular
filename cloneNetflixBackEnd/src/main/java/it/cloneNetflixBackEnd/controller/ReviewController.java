package it.cloneNetflixBackEnd.controller;

import it.cloneNetflixBackEnd.model.Review;
import it.cloneNetflixBackEnd.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;


    @PostMapping("/movies/{movieId}/users/{userId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER)")

    public ResponseEntity<Review> addReview(@PathVariable Long movieId, @PathVariable int userId, @RequestBody Review review) {
        Review savedReview = reviewService.addReviewForUser(userId, movieId, review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @GetMapping("/movies/{movieId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER)")

    public List<Review> getReviewsByMovieId(@PathVariable Long movieId) {
        return reviewService.getReviewsByMovieId(movieId);
    }
}
