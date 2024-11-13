package it.cloneNetflixBackEnd.interceptor;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.io.IOException;
import java.time.Duration;
@Component
public class RateLimitInterceptor implements HandlerInterceptor {
    private final Bucket bucket;

    public RateLimitInterceptor() {
        // Configura il rate limit: 10 richieste al minuto
        this.bucket = Bucket4j.builder()
                .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1))))
                .build();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (bucket.tryConsume(1)) {
            return true; // Consenti la richiesta
        } else {
            response.setStatus(429); // Codice di stato per Too Many Requests
            try {
                response.getWriter().write("Rate limit exceeded. Please try again later.");
            } catch (IOException e) {
                e.printStackTrace(); // Log dell'eccezione
            }
            return false; // Blocca la richiesta
        }
    }

}
