package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import javax.transaction.Transactional;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.friendship.Friendship;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface FriendshipRepository extends CrudRepository<Friendship, Integer> {

    @Query("SELECT f.friend FROM Friendship f "
            + "WHERE f.user = :user AND f.status = 'CONFIRMED' AND "
            + "(:not_in_cart_id IS NULL OR NOT EXISTS "
            + "(SELECT cu.user FROM CartUsers cu "
            + "WHERE cu.cart.id = :not_in_cart_id AND f.friend = cu.user))")
    List<User> getFriends(
            @Param("user") User user,
            @Param("not_in_cart_id") Integer notInCartId);

    List<Friendship> findFriendshipsByUser(User user);

    Friendship findFriendshipByUserAndFriend(User user, User friend);

    @Transactional
    void deleteFriendshipByFriendInAndUserIn(List<User> users, List<User> friends);
}
