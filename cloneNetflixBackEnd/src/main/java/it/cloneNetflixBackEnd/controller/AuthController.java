package Nextdevs.gestionaleassicurativo.controller;

import Nextdevs.gestionaleassicurativo.dto.AuthDataDto;
import Nextdevs.gestionaleassicurativo.dto.PasswordResetRequestDto;
import Nextdevs.gestionaleassicurativo.dto.UserDto;
import Nextdevs.gestionaleassicurativo.dto.UserLoginDto;
import Nextdevs.gestionaleassicurativo.exception.BadRequestException;
import Nextdevs.gestionaleassicurativo.service.AuthService;
import Nextdevs.gestionaleassicurativo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/auth/register")
    public Integer saveUser(@RequestBody @Validated UserDto userDto, BindingResult bindingResult) {
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(ObjectError::getDefaultMessage).reduce("",((s1, s2) -> s1+s2)));
        }
        return userService.saveUser(userDto);
    }

    @PostMapping("/auth/login")
    public AuthDataDto login(@RequestBody @Validated UserLoginDto userLoginDto, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            throw new BadRequestException(bindingResult.getAllErrors().stream().map(ObjectError::getDefaultMessage).
                    reduce("", (s, s2) -> s+s2));
        }

        return authService.authenticateUserAndCreateToken(userLoginDto);
    }

    @PostMapping("/auth/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequestDto requestDto) {
        try {
            authService.resetPassword(requestDto.getToken(), requestDto.getNewPassword());
            return ResponseEntity.ok().body(Map.of("message", "Password reset successful"));
        } catch (BadRequestException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
        }
    }


    @PostMapping("/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> emailRequest) {
        String email = emailRequest.get("email");
        // Chiama il servizio, ma non rivelare il risultato
        authService.forgotPassword(email);
        // Risposta generica
        return ResponseEntity.ok().body(Map.of("message", "Se l'email è registrata, riceverai un messaggio con le istruzioni."));
    }

}
