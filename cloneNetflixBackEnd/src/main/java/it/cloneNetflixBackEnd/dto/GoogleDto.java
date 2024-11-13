package it.cloneNetflixBackEnd.dto;

import lombok.Data;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
@Data
public class GoogleDto {
    private OAuth2AuthenticationToken token;

}
