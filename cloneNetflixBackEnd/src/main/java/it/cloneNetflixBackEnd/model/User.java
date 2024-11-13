package it.cloneNetflixBackEnd.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import it.cloneNetflixBackEnd.enums.TipoUser;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@Entity
public class User implements UserDetails {
    @Id
    @GeneratedValue
    private Integer idUser;
    private String nome;
    private String cognome;
    private String email;
    private String password;
    private String username;
    private String avatar;
    private LocalDate dataNascita;
    @Enumerated(EnumType.STRING)
    private TipoUser tipoUser;
    private String provider;
    private String telefono;
    private String indirizzo;
//    private String codiceFiscale;
    private String statoUtente;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UserList> userLists = new ArrayList<>();


    @Override
    public String getPassword() {
        return password;
    }

//    @Override
//    public String getUsername() {
//        return username;
//    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(tipoUser.name()));
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
