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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rukkila.minimalistsocketcart.model.entity.User;

@Entity
@Table(name = "cart_users")
public class CartUsers {

    public CartUsers() {}

    public CartUsers(Cart cart, User user) {
        this.id = new CartUsersKey(user.getId(), cart.getId());
        this.cart = cart;
        this.user = user;
    }

    @EmbeddedId
    private CartUsersKey id;

    @ManyToOne
    @MapsId("cartId")
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
//    @JsonIgnore
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

    public static CartUsers ofCartOwner(Cart cart, User user) {
        CartUsers cartUsers = new CartUsers(cart, user);
        cartUsers.setCartOwnership(CartOwnership.OWNER);
        return cartUsers;
    }

    public static CartUsers ofCartParticipant(Cart cart, User user) {
        CartUsers cartUsers = new CartUsers(cart, user);
        cartUsers.setCartOwnership(CartOwnership.PARTICIPANT);
        return cartUsers;
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
