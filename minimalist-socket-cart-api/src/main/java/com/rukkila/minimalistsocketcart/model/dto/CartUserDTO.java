package com.rukkila.minimalistsocketcart.model.dto;

import com.rukkila.minimalistsocketcart.model.entity.cart.CartOwnership;

public class CartUserDTO {
    private UserDTO user;
    private CartOwnership cartOwnership;

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public CartOwnership getCartOwnership() {
        return cartOwnership;
    }

    public void setCartOwnership(CartOwnership cartOwnership) {
        this.cartOwnership = cartOwnership;
    }
}
