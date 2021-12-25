package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.User;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    User findUserByUsername(String username);

    List<User> findAllByIdNot(Integer callerId);

    @Query("SELECT new User(u.id, u.username) FROM User u " +
           "WHERE u.id <> :caller_id " +
           "AND lower(u.username) LIKE :username_search_word " +
           "AND u.id NOT IN "
            + "(SELECT friend.id FROM Friendship WHERE user.id = :caller_id)")
    List<User> findNonFriendUsersContainingUsernameSearchWord(
            @Param("caller_id") Integer callerId,
            @Param("username_search_word") String usernameSearchWord);
}

