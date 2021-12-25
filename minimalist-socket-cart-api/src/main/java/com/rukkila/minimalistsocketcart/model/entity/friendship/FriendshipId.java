package com.rukkila.minimalistsocketcart.model.entity.friendship;

import java.io.Serializable;
import java.util.Objects;

public class FriendshipId implements Serializable {
    private int user;
    private int friend;

    public int getUser() {
        return user;
    }

    public void setUser(int user) {
        this.user = user;
    }

    public int getFriend() {
        return friend;
    }

    public void setFriend(int friend) {
        this.friend = friend;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FriendshipId that = (FriendshipId) o;
        return getUser() == that.getUser() && getFriend() == that.getFriend();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUser(), getFriend());
    }
}
