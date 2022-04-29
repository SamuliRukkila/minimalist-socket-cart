package com.rukkila.minimalistsocketcart.service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.friendship.Friendship;
import com.rukkila.minimalistsocketcart.model.status.FriendshipStatus;
import com.rukkila.minimalistsocketcart.repository.CartUsersRepository;
import com.rukkila.minimalistsocketcart.repository.FriendshipRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendshipService {

    private static final Logger log = LoggerFactory.getLogger(FriendshipService.class);

    @Autowired
    private FriendshipRepository friendshipRepository;
    @Autowired
    private CartUsersRepository cartUsersRepository;
    @Autowired
    private CartService cartService;
    @Autowired
    private UserService userService;

    public List<User> getFriends() {
        User user = userService.getCurrentLoggedUser();
        List<User> friends = friendshipRepository.getFriends(user);

        if (log.isDebugEnabled()) {
            if (friends.isEmpty()) {
                log.debug("Did not find any friends for: {}", user);
            }
            else {
                log.debug("Found {} friends for: {}", friends.size(), user);
            }
        }
        return friends;
    }

    public List<User> findFriendsNotInCart(Integer cartId) {
        User user = userService.getCurrentLoggedUser();

        cartService.checkPermissionsToCartAction(cartId, false);

        List<User> friends = friendshipRepository.getFriends(user);
        if (friends.isEmpty()) {
            log.debug("Did not find any friends for {}", user);
            return Collections.emptyList();
        }

        List<User> usersInCart =
                cartUsersRepository.findUsersByCartId(user, cartId);

        List<User> friendsNotInCart = friends.stream()
                .filter(friend -> !usersInCart.contains(friend))
                .collect(Collectors.toList());

        if (log.isDebugEnabled()) {
            if (friendsNotInCart.isEmpty()) {
                log.debug("No {}'s friends ({}) in cart '{}', returning all",
                        user, friends.size(), cartId);
            }
            else {
                log.debug("Found '{}' out of '{}' friends who weren't in cart"
                                + " '{}' yet. Caller: {}",
                        friendsNotInCart.size(), friends.size(), cartId, user);
            }
        }
        return friendsNotInCart;
    }

    public List<Friendship> getFriendships() {
        User user = userService.getCurrentLoggedUser();
        List<Friendship> foundFriendships =
                friendshipRepository.findFriendshipsByUser(user);

        if (log.isDebugEnabled()) {
            if (foundFriendships.isEmpty()) {
                log.debug("Did not find any friendships for {}", user);
            }
            else {
                log.debug("Found {} friendships for {}",
                        foundFriendships.size(), user);
            }
        }

        return foundFriendships;
    }

    public void sendFriendRequest(Integer friendId) {
        User user = userService.getCurrentLoggedUser();
        User friend = userService.getUser(friendId);

        Friendship existingFriendship = getFriendship(user, friend);
        if (existingFriendship != null) {
            log.warn("There is already a friendship-relation. Skipping "
                            + "request: {}", existingFriendship);
            return;
        }

        Friendship requestSentNewFriendship =
                Friendship.ofRequestSent(user, friend);
        Friendship requestReceivedNewFriendship =
                Friendship.ofRequestReceived(friend, user);

        friendshipRepository.saveAll(Arrays.asList(
                requestSentNewFriendship, requestReceivedNewFriendship));

        log.info("Friendship request sent from {} to {}",
                user, friend);
    }

    public void removeAllFriendships(Integer friendId) {
        User user = userService.getCurrentLoggedUser();
        User friend = userService.getUser(friendId);

        friendshipRepository.deleteFriendshipByFriendInAndUserIn(
                Arrays.asList(user, friend), Arrays.asList(friend, user));

        log.info("Friendship(s) between {} and {} removed", user, friend);
    }

    public Friendship getFriendship(User user, User friend) {
        return friendshipRepository.findFriendshipByUserAndFriend(user, friend);
    }

    public void acceptFriendRequest(Integer friendId) {
        User user = userService.getCurrentLoggedUser();
        User friend = userService.getUser(friendId);

        Friendship existingFriendship1 = getFriendship(user, friend);
        Friendship existingFriendship2 = getFriendship(friend, user);
        if (existingFriendship1 == null || existingFriendship2 == null) {
            String errorMessage = String.format("%s can't accept "
                    + "friend request from %s since there were not "
                    + "REQUEST_RECEIVED and REQUEST_SENT friendships.",
                    user, friend);
            throw new IllegalStateException(errorMessage);
        }

        existingFriendship1.setStatus(FriendshipStatus.CONFIRMED);
        existingFriendship2.setStatus(FriendshipStatus.CONFIRMED);

        friendshipRepository.saveAll(
                Arrays.asList(existingFriendship1, existingFriendship2));

        log.info("Established {} friendship between {} and {}",
                FriendshipStatus.CONFIRMED, user, friend);
    }
}
