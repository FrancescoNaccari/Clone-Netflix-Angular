package Nextdevs.gestionaleassicurativo.repository;

import Nextdevs.gestionaleassicurativo.model.PasswordResetToken;
import Nextdevs.gestionaleassicurativo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUser(User user);
}