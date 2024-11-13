package it.cloneNetflixBackEnd.service;

import it.cloneNetflixBackEnd.model.User;
import it.cloneNetflixBackEnd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service

public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Metodo per registrare un nuovo utente
    public User registerUser(User user) {
        // Cripta la password dell'utente
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Imposta un ruolo di default
        user.getRoles().add("ROLE_USER");
        // Salva l'utente nel database
        return userRepository.save(user);
    }

    // Metodo per trovare un utente per username
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Metodo per controllare se un utente esiste per email
    public boolean userExistsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
