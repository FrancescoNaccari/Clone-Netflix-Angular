package it.cloneNetflixBackEnd.repository;

import it.cloneNetflixBackEnd.model.PasswordResetToken;
import it.cloneNetflixBackEnd.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);
}