package it.cloneNetflixBackEnd.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePasswordDto {
    @NotBlank(message = "La password attuale non può essere vuota")
    private String currentPassword;


    @NotBlank(message = "La nuova password non può essere vuota")
//    @Size(min = 8, message = "La nuova password deve contenere almeno 8 caratteri")
//    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
//            message = "La nuova password deve contenere almeno una lettera maiuscola, una lettera minuscola, un numero e un carattere speciale")
    private String newPassword;
}