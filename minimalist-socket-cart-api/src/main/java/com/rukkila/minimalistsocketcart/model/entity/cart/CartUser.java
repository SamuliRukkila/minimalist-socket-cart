package com.rukkila.minimalistsocketcart.model.entity.cart;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

import com.rukkila.minimalistsocketcart.model.entity.User;

@Entity
@Table(name = "cart_users")
public class CartUser {

    public CartUser() {}

    public CartUser(Cart cart, User user) {
        this.id = new CartUsersKey(user.getId(), cart.getId());
        this.cart = cart;
        this.user = user;
    }

    @EmbeddedId
    private CartUsersKey id;

    @ManyToOne
    @MapsId("cartId")
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CartOwnership cartOwnership;

    public CartUsersKey getId() {
        return id;
    }

    public void setId(CartUsersKey id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CartOwnership getCartOwnership() {
        return cartOwnership;
    }

    public void setCartOwnership(CartOwnership cartOwnership) {
        this.cartOwnership = cartOwnership;
    }

    public static CartUser ofCartOwner(Cart cart, User user) {
        CartUser cartUser = new CartUser(cart, user);
        cartUser.setCartOwnership(CartOwnership.OWNER);
        return cartUser;
    }

    public static CartUser ofCartParticipant(Cart cart, User user) {
        CartUser cartUser = new CartUser(cart, user);
        cartUser.setCartOwnership(CartOwnership.PARTICIPANT);
        return cartUser;
    }

    @Override
    public String toString() {
        return "CartUsers {" +
                "user=" + user +
                ", cart=" + cart +
                ", cartOwnership=" + cartOwnership +
                '}';
    }
}
