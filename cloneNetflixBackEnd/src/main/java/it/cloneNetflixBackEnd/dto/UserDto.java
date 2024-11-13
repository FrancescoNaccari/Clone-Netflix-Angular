package it.cloneNetflixBackEnd.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDto {

    private String nome;
    private String cognome;
    @Email( regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$" )
    @NotBlank(message = "L'email dell'utente non può essere vuota, mancante o composta da soli spazi")
    private String email;
    @NotBlank(message = "La password non può essere vuota, mancante o composta da soli spazi")
    @NotBlank(message = "La password non può essere vuota")
//    @Size(min = 8, message = "La password deve contenere almeno 8 caratteri")
//    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
//            message = "La password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale")
    private String password;
    private String avatar;
//    @NotBlank(message = "Lo username dell'utente non può essere vuoto, mancante o composto da soli spazi")

//    private String username;
    private LocalDate dataNascita;
    private String provider;
    private String telefono;
    private String indirizzo;
//    private String codiceFiscale;
    private String statoUtente;
}
