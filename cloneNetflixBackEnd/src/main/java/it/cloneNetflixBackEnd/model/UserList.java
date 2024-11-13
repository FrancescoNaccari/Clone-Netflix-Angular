package it.cloneNetflixBackEnd.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Entity
public class UserList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String listName;

    @ManyToOne
    private User user;

    @ManyToMany
    @JoinTable(
            name = "userlist_movie",
            joinColumns = @JoinColumn(name = "userlist_id"),
            inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private Set<Movie> movies;
}

