package it.cloneNetflixBackEnd.dto;

import it.cloneNetflixBackEnd.enums.TipoUser;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserDataDto {
    private int idUser;
    private String nome;
    private String cognome;
    private String email;
//    private String username;
    private String avatar;
    private LocalDate dataNascita;
    private TipoUser tipoUser;
    private String telefono;
    private String indirizzo;
//    private String codiceFiscale;
    private String statoUtente;
}
