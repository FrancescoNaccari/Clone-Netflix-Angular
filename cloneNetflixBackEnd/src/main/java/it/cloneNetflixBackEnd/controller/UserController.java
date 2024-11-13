package it.cloneNetflixBackEnd.controller;


import it.cloneNetflixBackEnd.dto.UpdatePasswordDto;
import it.cloneNetflixBackEnd.dto.UserDataDto;
import it.cloneNetflixBackEnd.dto.UserDto;
import it.cloneNetflixBackEnd.exception.BadRequestException;
import it.cloneNetflixBackEnd.exception.NotFoundException;
import it.cloneNetflixBackEnd.model.User;
import it.cloneNetflixBackEnd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true")
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public Page<User> getAllUser(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "15") int size,
                                 @RequestParam(defaultValue = "id") String sortBy) {
        return userService.getAllUsers(page, size, sortBy);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public User getUserById(@PathVariable int id) throws NotFoundException {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            return userOptional.get();
        } else {
            throw new NotFoundException("User con id: " + id + " non trovata");
        }
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public User updateUser(@PathVariable int id, @RequestBody @Validated UserDto userDto, BindingResult bindingResult) throws NotFoundException {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(e -> e.getDefaultMessage()).reduce("", ((s1, s2) -> s1 + s2)));
        }
        return userService.updateUser(id, userDto);
    }

    @PatchMapping("/users/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public UserDataDto patchUser(@PathVariable int id, @RequestBody UserDto userDto) {
        return userService.patchUser(id, userDto);
    }

    @PatchMapping(value = "/users/{id}/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public UserDataDto patchAvatarUser(@PathVariable int id, @RequestParam("file") MultipartFile avatar) throws IOException {
        return userService.patchAvatarUser(id, avatar);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String deleteUser(@PathVariable int id) throws NotFoundException {
        return userService.deleteUser(id);
    }

    @PatchMapping("/users/{id}/password")
    @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
    public void updatePassword(@PathVariable int id, @RequestBody @Validated UpdatePasswordDto updatePasswordDto, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().stream()
                    .map(e -> e.getDefaultMessage()).reduce("", ((s1, s2) -> s1 + s2)));
        }
        userService.updatePassword(id, updatePasswordDto);
    }


    @PutMapping("/{userId}/profile")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USER')")
    public ResponseEntity<User> updateProfile(@PathVariable int userId, @RequestBody UserDto userDto) {
        User updatedUser = userService.updateProfile(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }
}
