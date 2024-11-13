package it.cloneNetflixBackEnd.dto;


import lombok.Data;

@Data
public class PasswordResetRequestDto {
    private String token;
    private String newPassword;
}
