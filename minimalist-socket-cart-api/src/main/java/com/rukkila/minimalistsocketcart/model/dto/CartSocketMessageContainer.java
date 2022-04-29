package com.rukkila.minimalistsocketcart.model.dto;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;

public class CartSocketMessageContainer {
    private User user;
    private Cart cart;
    private Integer cartId;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Integer getCartId() {
        return cartId;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    @Override
    public String toString() {
        return "CartSocketMessageContainer{" +
                "user=" + user +
                ", cart=" + cart +
                ", cartId=" + cartId +
                '}';
    }
}
