package it.cloneNetflixBackEnd.repository;

import it.cloneNetflixBackEnd.model.UserList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserListRepository extends JpaRepository<UserList, Long> {
    List<UserList> findByUserIdUser(Integer idUser);
}
