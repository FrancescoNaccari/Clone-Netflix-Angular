package it.cloneNetflixBackEnd.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginDto {

    @Email
    @NotBlank(message = "L'email non può essere vuota, mancante o composta da soli spazi")
    private String email;
    @NotBlank(message = "La password non può essere vuota, mancante o composta da soli spazi")
    private String password;
}
