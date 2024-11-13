package Nextdevs.gestionaleassicurativo.service;

import Nextdevs.gestionaleassicurativo.dto.AuthDataDto;
import Nextdevs.gestionaleassicurativo.dto.UserDataDto;
import Nextdevs.gestionaleassicurativo.dto.UserLoginDto;
import Nextdevs.gestionaleassicurativo.exception.UnauthorizedException;
import Nextdevs.gestionaleassicurativo.model.User;
import Nextdevs.gestionaleassicurativo.security.JwtTool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtTool jwtTool;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthDataDto authenticateUserAndCreateToken(UserLoginDto userLoginDTO){
        Optional<User>userOptional= userService.getUserByEmail(userLoginDTO.getEmail());

        if(userOptional.isEmpty()){
            throw new UnauthorizedException("Error authenticating, relogin!");
        }else {
            User user = userOptional.get();
            if(passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())){
                AuthDataDto authDataDto = new AuthDataDto();
                authDataDto.setAccessToken(jwtTool.createToken(user));
                UserDataDto userDataDto = new UserDataDto();
                userDataDto.setNome(user.getNome());
                userDataDto.setCognome(user.getCognome());
                userDataDto.setEmail(user.getEmail());
                userDataDto.setIdUser(user.getIdUser());
                userDataDto.setUsername(user.getUsername());
                userDataDto.setAvatar(user.getAvatar());
                userDataDto.setDataNascita(user.getDataNascita());
                userDataDto.setTipoUser(user.getTipoUser());
                authDataDto.setUser(userDataDto);
                return authDataDto;
            } else {
                throw new UnauthorizedException("Error in authorization, relogin!");
            }
        }
    }
    public void resetPassword(String token, String newPassword) {
        userService.resetPassword(token, newPassword);
    }
    public void forgotPassword(String email) {
        userService.sendPasswordResetToken(email);
    }


}
