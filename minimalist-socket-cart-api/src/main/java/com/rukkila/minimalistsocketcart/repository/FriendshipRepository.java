package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import javax.transaction.Transactional;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.friendship.Friendship;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface FriendshipRepository extends
        CrudRepository<Friendship, Integer>,
        JpaSpecificationExecutor<Friendship> {

    @Query("SELECT f.friend FROM Friendship f "
            + "WHERE f.user = :user AND "
            + "f.status = 'CONFIRMED'")
    List<User> getFriends(@Param("user") User user);

//    @Query("SELECT f.friend FROM Friendship f "
//            + "WHERE f.user = :user AND "
//            + "f.status = 'CONFIRMED' AND "
//            + "f.friend NOT IN "
//            + "(SELECT cu.user FROM CartUser cu "
//            + "WHERE cu.cart.id = :cart_id AND f.friend = cu.user)")
//    List<User> findFriendsNotInCart(@Param("user") User user,
//                                    @Param("cartId") Integer cartId);

    List<Friendship> findFriendshipsByUser(User user);

    Friendship findFriendshipByUserAndFriend(User user, User friend);

    @Transactional
    void deleteFriendshipByFriendInAndUserIn(List<User> users, List<User> friends);
}
