package it.cloneNetflixBackEnd.service;

import it.cloneNetflixBackEnd.exception.NotFoundException;
import it.cloneNetflixBackEnd.model.Movie;
import it.cloneNetflixBackEnd.model.Review;
import it.cloneNetflixBackEnd.model.User;
import it.cloneNetflixBackEnd.repository.MovieRepository;
import it.cloneNetflixBackEnd.repository.ReviewRepository;
import it.cloneNetflixBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    public Review addReviewForUser(int userId, Long movieId, Review review) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new NotFoundException("Movie not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        review.setMovie(movie);
        review.setUser(user);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByMovieId(Long movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    public void deleteUserReview(int userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Review not found"));

        if (review.getUser().getIdUser() != userId) {
            throw new IllegalArgumentException("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);
    }
}
