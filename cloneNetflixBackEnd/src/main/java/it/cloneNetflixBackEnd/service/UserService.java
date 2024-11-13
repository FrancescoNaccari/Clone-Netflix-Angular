package it.cloneNetflixBackEnd.service;

import com.cloudinary.Cloudinary;
import it.cloneNetflixBackEnd.dto.UpdatePasswordDto;
import it.cloneNetflixBackEnd.dto.UserDataDto;
import it.cloneNetflixBackEnd.dto.UserDto;
import it.cloneNetflixBackEnd.enums.TipoUser;
import it.cloneNetflixBackEnd.exception.BadRequestException;
import it.cloneNetflixBackEnd.exception.NotFoundException;
import it.cloneNetflixBackEnd.exception.UnauthorizedException;
import it.cloneNetflixBackEnd.model.Movie;
import it.cloneNetflixBackEnd.model.PasswordResetToken;
import it.cloneNetflixBackEnd.model.User;
import it.cloneNetflixBackEnd.model.UserList;

import it.cloneNetflixBackEnd.repository.PasswordResetTokenRepository;
import it.cloneNetflixBackEnd.repository.UserListRepository;
import it.cloneNetflixBackEnd.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private UserListRepository userListRepository;


    @Autowired
    private JavaMailSenderImpl javaMailSender;
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    // Metodo per registrare un nuovo utente
    public Integer saveUser(UserDto userDto) {
        if (getUserByEmail(userDto.getEmail()).isEmpty()) {
            User user = new User();
            user.setNome(userDto.getNome());
            user.setCognome(userDto.getCognome());
            user.setEmail(userDto.getEmail());
            user.setTipoUser(TipoUser.USER);
            user.setDataNascita(userDto.getDataNascita());
//            user.setUsername(userDto.getUsername());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            user.setTelefono(userDto.getTelefono());
            user.setIndirizzo(userDto.getIndirizzo());
//            user.setCodiceFiscale(userDto.getCodiceFiscale());
            user.setStatoUtente(userDto.getStatoUtente());

            userRepository.save(user);
            //sendMailRegistrazione(userDto.getEmail()); da rimettere


            return user.getIdUser();
        } else {
            throw new BadRequestException("Email già esistente");
        }
    }
    public Page<User> getAllUsers(int page, int size , String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return userRepository.findAll(pageable);
    }

    public Optional<User> getUserById(int id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            return Optional.of(user);
        } else {
            return Optional.empty();
        }
    }

    public User updateUser(int id, UserDto userDto) {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setNome(userDto.getNome());
            user.setCognome(userDto.getCognome());
//            user.setUsername(userDto.getUsername());
            user.setEmail(userDto.getEmail());
            user.setDataNascita(userDto.getDataNascita());
            user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            user.setTelefono(userDto.getTelefono());
            user.setIndirizzo(userDto.getIndirizzo());
//            user.setCodiceFiscale(userDto.getCodiceFiscale());
            return userRepository.save(user);
        } else {
            throw new NotFoundException("User with id:" + id + " not found");
        }
    }

    public String deleteUser(int id) {
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
            return "User with id:" + id + " correctly deleted";
        } else {
            throw new NotFoundException("User with id:" + id + " not found");
        }
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserDataDto patchUser(Integer id, UserDto userDto) {
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
//            if (userDto.getUsername() != null) {
//                user.setUsername(userDto.getUsername());
//            }
            if (userDto.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(userDto.getPassword()));
            }
            if (userDto.getNome() != null) {
                user.setNome(userDto.getNome());
            }
            if (userDto.getCognome() != null) {
                user.setCognome(userDto.getCognome());
            }
            if (userDto.getEmail() != null) {
                user.setEmail(userDto.getEmail());
            }
            if (userDto.getAvatar() != null) {
                user.setAvatar(userDto.getAvatar());
            }
            if (userDto.getDataNascita() != null) {
                user.setDataNascita(userDto.getDataNascita());
            }
            if (userDto.getTelefono() != null) {
                user.setTelefono(userDto.getTelefono());
            }
            if (userDto.getIndirizzo() != null) {
                user.setIndirizzo(userDto.getIndirizzo());
            }
//            if (userDto.getCodiceFiscale() != null) {
//                user.setCodiceFiscale(userDto.getCodiceFiscale());
//            }
            if (userDto.getStatoUtente() != null) {
                user.setStatoUtente(userDto.getStatoUtente());
            }

            userRepository.save(user);

            UserDataDto userDataDto = new UserDataDto();
            userDataDto.setNome(user.getNome());
            userDataDto.setCognome(user.getCognome());
            userDataDto.setAvatar(user.getAvatar());
            userDataDto.setEmail(user.getEmail());
            userDataDto.setDataNascita(user.getDataNascita());
//            userDataDto.setUsername(user.getUsername());
            userDataDto.setIdUser(user.getIdUser());
            userDataDto.setTipoUser(user.getTipoUser());
            userDataDto.setTelefono(user.getTelefono());
            userDataDto.setIndirizzo(user.getIndirizzo());
//            userDataDto.setCodiceFiscale(user.getCodiceFiscale());
            userDataDto.setStatoUtente(user.getStatoUtente());

            return userDataDto;
        } else {
            throw new NotFoundException("Utente con id "+id+" non trovato");
        }
    }

    public UserDataDto patchAvatarUser(Integer id, MultipartFile avatar) throws IOException {
        Optional<User> userOptional = getUserById(id);

        if (userOptional.isPresent()) {
            // Valida il tipo di file
            String contentType = avatar.getContentType();
            if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
                throw new BadRequestException("Formato file non supportato. Sono permessi solo JPEG e PNG.");
            }

            // Limita la dimensione del file (es. max 2MB)
            if (avatar.getSize() > 2 * 1024 * 1024) {
                throw new BadRequestException("Il file è troppo grande. La dimensione massima consentita è di 2MB.");
            }

            // Carica il file su Cloudinary
            Map uploadResult = cloudinary.uploader().upload(avatar.getBytes(), Collections.emptyMap());
            String url = (String) uploadResult.get("url");

            // Aggiorna l'utente con il nuovo avatar
            User user = userOptional.get();
            user.setAvatar(url);
            userRepository.save(user);

            // Prepara il DTO per la risposta
            UserDataDto userDataDto = new UserDataDto();
            userDataDto.setIdUser(user.getIdUser());
            userDataDto.setNome(user.getNome());
            userDataDto.setCognome(user.getCognome());
            userDataDto.setEmail(user.getEmail());
//            userDataDto.setUsername(user.getUsername());
            userDataDto.setAvatar(user.getAvatar());
            userDataDto.setDataNascita(user.getDataNascita());
            userDataDto.setTipoUser(user.getTipoUser());
            userDataDto.setTelefono(user.getTelefono());
            userDataDto.setIndirizzo(user.getIndirizzo());
//            userDataDto.setCodiceFiscale(user.getCodiceFiscale());
            userDataDto.setStatoUtente(user.getStatoUtente());

            return userDataDto;
        } else {
            throw new NotFoundException("Utente con id " + id + " non trovato");
        }
    }


    public void updatePassword(int id, UpdatePasswordDto updatePasswordDto) {
        Optional<User> userOptional = getUserById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!passwordEncoder.matches(updatePasswordDto.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("La password attuale non è corretta");
            }
            user.setPassword(passwordEncoder.encode(updatePasswordDto.getNewPassword()));
            userRepository.save(user);
        } else {
            throw new NotFoundException("User con id: " + id + " non trovato");
        }
    }

    private void savePasswordResetToken(User user, String token) {
        // Imposta la data di scadenza (ad esempio, 24 ore da ora)
        LocalDateTime expirationDate = LocalDateTime.now().plusHours(24);

        // Verifica se esiste già un token per questo utente e, se sì, aggiornalo
        Optional<PasswordResetToken> existingToken = passwordResetTokenRepository.findByUser(user);
        PasswordResetToken resetToken;
        if (existingToken.isPresent()) {
            resetToken = existingToken.get();
            resetToken.setToken(token);
            resetToken.setExpirationDate(expirationDate);
        } else {
            resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setToken(token);
            resetToken.setExpirationDate(expirationDate);
        }

        passwordResetTokenRepository.save(resetToken);
    }
    public void sendPasswordResetToken(String email) {
        long startTime = System.currentTimeMillis(); // Inizio misurazione del tempo

        Optional<User> userOptional = userRepository.findByEmail(email);
        long afterDbQueryTime = System.currentTimeMillis();
        logger.info("Tempo per recuperare l'utente dal database: " + (afterDbQueryTime - startTime) + " ms");

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();

            // Salva il token con una scadenza (es. 24 ore)
            savePasswordResetToken(user, token);
            long afterTokenSaveTime = System.currentTimeMillis();
            logger.info("Tempo per salvare il token di reset: " + (afterTokenSaveTime - afterDbQueryTime) + " ms");

            // Costruisci il link di reset password
            String resetLink = "https://localhost:4200//reset-password?token=" + token;

            // Invia l'email
            sendResetPasswordEmail(user.getEmail(), resetLink);
            long afterEmailSendTime = System.currentTimeMillis();
            logger.info("Tempo per inviare l'email: " + (afterEmailSendTime - afterTokenSaveTime) + " ms");
        } else {
            System.out.println("Email non trovata, ma per motivi di sicurezza non si comunica nulla.");
        }

        long endTime = System.currentTimeMillis(); // Fine misurazione del tempo
        logger.info("Tempo totale per l'operazione forgot-password: " + (endTime - startTime) + " ms");
    }

    private void sendResetPasswordEmail(String email, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Recupero Password");
        message.setText("Clicca sul seguente link per reimpostare la tua password: " + resetLink);

        javaMailSender.send(message);
    }
    public void resetPassword(String token, String newPassword) {
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("La nuova password non può essere null o vuota");
        }
        Optional<PasswordResetToken> tokenOptional = passwordResetTokenRepository.findByToken(token);

        if (tokenOptional.isPresent()) {
            PasswordResetToken resetToken = tokenOptional.get();
            // Controlla se il token è scaduto
            if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
                throw new BadRequestException("Il token è scaduto");
            }

            User user = resetToken.getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            // Elimina il token dopo l'uso
            passwordResetTokenRepository.delete(resetToken);
        } else {
            throw new BadRequestException("Token non valido o scaduto");
        }
    }

    public UserList createUserList(Integer userId, String listName) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        UserList userList = new UserList();
        userList.setListName(listName);
        userList.setUser(user);
        return userListRepository.save(userList);
    }

    public UserList addMovieToList(Integer userId, Long listId, Long movieId) {
        UserList userList = userListRepository.findById(listId)
                .orElseThrow(() -> new NotFoundException("List not found"));

        // Confronto corretto usando `Integer.valueOf(userId)`
        if (!Integer.valueOf(userList.getUser().getIdUser()).equals(userId)) {
            throw new UnauthorizedException("You don't have access to this list");
        }

        return userListRepository.save(userList);
    }


    public UserList removeMovieFromList(Integer userId, Long listId, Long movieId) {
        UserList userList = userListRepository.findById(listId)
                .orElseThrow(() -> new NotFoundException("List not found"));

        if (!Integer.valueOf(userList.getUser().getIdUser()).equals(userId)) {
            throw new UnauthorizedException("You don't have access to this list");
        }

        userList.getMovies().removeIf(movie -> movie.getId().equals(movieId));
        return userListRepository.save(userList);
    }

    public User updateProfile(int userId, UserDto userDto) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("User not found"));
        if (userDto.getNome() != null) user.setNome(userDto.getNome());
        if (userDto.getCognome() != null) user.setCognome(userDto.getCognome());
        if (userDto.getEmail() != null) user.setEmail(userDto.getEmail());
        if (userDto.getTelefono() != null) user.setTelefono(userDto.getTelefono());
        if (userDto.getIndirizzo() != null) user.setIndirizzo(userDto.getIndirizzo());
        return userRepository.save(user);
    }
}
