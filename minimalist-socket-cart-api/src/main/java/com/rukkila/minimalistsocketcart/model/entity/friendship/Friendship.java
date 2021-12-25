package com.rukkila.minimalistsocketcart.model.entity.friendship;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.status.FriendshipStatus;

@Entity
@Table(name = "friendship")
@IdClass(FriendshipId.class)
public class Friendship {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id",
                referencedColumnName = "id",
                nullable = false)
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "friend_id",
                referencedColumnName = "id",
                nullable = false)
    private User friend;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FriendshipStatus status;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getFriend() {
        return friend;
    }

    public void setFriend(User friend) {
        this.friend = friend;
    }

    public FriendshipStatus getStatus() {
        return status;
    }

    public void setStatus(FriendshipStatus friendshipStatus) {
        this.status = friendshipStatus;
    }

    public static Friendship of(User user, User friend) {
        Friendship friendShip = new Friendship();
        friendShip.setUser(user);
        friendShip.setFriend(friend);
        return friendShip;
    }

    public static Friendship ofRequestSent(User sender, User receiver) {
        Friendship friendship = of(sender, receiver);
        friendship.setStatus(FriendshipStatus.REQUEST_SENT);
        return friendship;
    }

    public static Friendship ofRequestReceived(User sender, User receiver) {
        Friendship friendship = of(sender, receiver);
        friendship.setStatus(FriendshipStatus.REQUEST_RECEIVED);
        return friendship;
    }

    public static Friendship ofConfirmed(User user, User friend) {
        Friendship friendship = of(user, friend);
        friendship.setStatus(FriendshipStatus.CONFIRMED);
        return friendship;
    }

    @Override
    public String toString() {
        return "Friendship{" +
                "user=" + user.getId() +
                ", friend=" + friend.getId() +
                ", status=" + status.toString() + "}";
    }
}
