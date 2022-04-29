package com.rukkila.minimalistsocketcart.rest;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.friendship.Friendship;
import com.rukkila.minimalistsocketcart.service.FriendshipService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/friendship")
public class FriendshipController {

    @Autowired
    private FriendshipService friendshipService;

    @GetMapping("/friends")
    public ResponseEntity<List<User>> getFriends() {
        List<User> friends = friendshipService.getFriends();
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/friends/not-in-cart/{cartId}")
    public ResponseEntity<List<User>> findFriendsNotInCart(
            @PathVariable("cartId") Integer cartId) {
        List<User> friendsNotInCart =
                friendshipService.findFriendsNotInCart(cartId);
        return ResponseEntity.ok(friendsNotInCart);
    }

    @GetMapping
    public ResponseEntity<List<Friendship>> getAllFriendships() {
        List<Friendship> friendshipList = friendshipService.getFriendships();
        return ResponseEntity.ok(friendshipList);
    }

    @PostMapping("/request/{friendId}")
    public ResponseEntity<Void> sendFriendRequest(
            @PathVariable("friendId") Integer friendId) {
        friendshipService.sendFriendRequest(friendId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/request/{friendId}")
    public ResponseEntity<Void> removeFriendRequest(
            @PathVariable("friendId") Integer friendId) {
        friendshipService.removeAllFriendships(friendId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/request/accept/{friendId}")
    public ResponseEntity<Void> acceptFriendRequest(
            @PathVariable("friendId") Integer friendId) {
        friendshipService.acceptFriendRequest(friendId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/request/reject/{friendId}")
    public ResponseEntity<Void> rejectFriendRequest(
            @PathVariable("friendId") Integer friendId) {
        friendshipService.removeAllFriendships(friendId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{friendId}")
    public ResponseEntity<Void> removeFriendship(
            @PathVariable("friendId") Integer friendId) {
        friendshipService.removeAllFriendships(friendId);
        return ResponseEntity.ok().build();
    }
}
