package com.rukkila.minimalistsocketcart.model.entity.cart;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class CartUsersKey implements Serializable {

    public CartUsersKey() {}

    public CartUsersKey(Integer userId, Integer cartId) {
        this.userId = userId;
        this.cartId = cartId;
    }

    @Column(name = "user_id", nullable = false)
    private Integer userId;
    @Column(name = "cart_id", nullable = false)
    private Integer cartId;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(int user) {
        this.userId = user;
    }

    public Integer getCartId() {
        return cartId;
    }

    public void setCartId(int cart) {
        this.cartId = cart;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartUsersKey)) return false;
        CartUsersKey that = (CartUsersKey) o;
        return getUserId().equals(that.getUserId()) &&
                getCartId().equals(that.getCartId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getUserId(), getCartId());
    }
}
