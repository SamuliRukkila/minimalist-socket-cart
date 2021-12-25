package com.rukkila.minimalistsocketcart.service;

import java.util.Arrays;
import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.friendship.Friendship;
import com.rukkila.minimalistsocketcart.model.status.FriendshipStatus;
import com.rukkila.minimalistsocketcart.repository.FriendshipRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendshipService {
    private static final Logger log =
            LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private FriendshipRepository friendshipRepository;
    @Autowired
    private UserService userService;

    public List<User> getFriends(Integer notInCartId) {
        User user = userService.getCurrentLoggedUser();
        List<User> friends = friendshipRepository.getFriends(user, notInCartId);

        if (log.isDebugEnabled()) {
            if (friends.isEmpty()) {
                log.debug("Did not find any friends for {}", user);
            }
            else {
                log.debug("Found {} friends of {}", friends.size(), user);
            }
        }
        return friends;
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

        log.info("Friendship request sent from user {} to {}",
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
