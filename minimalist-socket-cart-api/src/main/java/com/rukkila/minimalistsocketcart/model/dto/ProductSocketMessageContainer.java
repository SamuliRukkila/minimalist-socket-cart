package com.rukkila.minimalistsocketcart.model.dto;

import com.rukkila.minimalistsocketcart.model.entity.Product;
import com.rukkila.minimalistsocketcart.model.entity.User;

public class ProductSocketMessageContainer {
    private User user;
    private Integer cartId;
    private Product product;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getCartId() {
        return cartId;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    @Override
    public String toString() {
        return "ProductSocketMessageContainer{" +
                "user=" + user +
                ", cartId=" + cartId +
                ", product=" + product +
                '}';
    }
}
