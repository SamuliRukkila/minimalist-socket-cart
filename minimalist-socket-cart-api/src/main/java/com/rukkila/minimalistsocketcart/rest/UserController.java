package com.rukkila.minimalistsocketcart.rest;

import java.util.List;

import javax.websocket.server.PathParam;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/exists")
    public ResponseEntity<Boolean> userExists(
            @RequestParam("username") String username) {
        boolean userAlreadyExists = userService.userAlreadyExists(username);
        return ResponseEntity.ok(userAlreadyExists);
    }

    @GetMapping()
    public ResponseEntity<List<User>> findAll() {
        List<User> users = userService.findUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/non-friends")
    public ResponseEntity<List<User>> findAllNonFriendUsers() {
        List<User> nonFriendUsers = userService.findAllNonFriendUsers();
        return ResponseEntity.ok(nonFriendUsers);
    }

    @GetMapping("/search/non-friend")
    public ResponseEntity<List<User>> searchUsers(
            @PathParam("username") String username) {
        List<User> foundUsers =
                userService.findNonFriendUsersByUsernameSearchWord(username);
        return ResponseEntity.ok(foundUsers);
    }
}
