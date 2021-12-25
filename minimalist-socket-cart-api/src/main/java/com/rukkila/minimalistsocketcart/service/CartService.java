package com.rukkila.minimalistsocketcart.service;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;
import com.rukkila.minimalistsocketcart.model.entity.cart.CartUsers;
import com.rukkila.minimalistsocketcart.model.status.CartStatus;
import com.rukkila.minimalistsocketcart.repository.CartRepository;
import com.rukkila.minimalistsocketcart.repository.CartUsersRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {
    private static final Logger log =
            LoggerFactory.getLogger(CartService.class);

    private static final Sort SORT_BY_STATUS_CREATED = Sort.by(
            Sort.Order.asc("status"), Sort.Order.desc("createdAt"));

    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartUsersRepository cartUsersRepository;
    @Autowired
    private UserService userService;

    public List<Cart> getCarts() {
        User user = userService.getCurrentLoggedUser();
        List<Cart> carts = cartRepository.findByUsers_User(
                user, SORT_BY_STATUS_CREATED);

        if (log.isDebugEnabled()) {
            int amountOfCarts = carts.size();
            if (amountOfCarts > 0) {
                log.debug("Found {} cart(s) for {}", amountOfCarts, user);
            }
            else {
                log.debug("No carts were found for {}", user);
            }
        }
        return carts;
    }

    @Transactional
    public Cart createCart(String name) {
        User user = userService.getCurrentLoggedUser();
        Cart newCart = Cart.ofCreated(name);
        Cart createdCart = cartRepository.save(newCart);

        CartUsers cartUsers = CartUsers.ofCartOwner(createdCart, user);
        cartUsersRepository.save(cartUsers);

        log.debug("{} created a new {}", user, createdCart);
        return createdCart;
    }

    public Cart updateCart(int cartId, Cart updatedCart) {
        Cart cart = getCart(cartId);
        String oldName = cart.getName();
        cart.setName(updatedCart.getName());

        log.debug("{}'s name updated from '{}' to '{}'", cart,
                oldName, cart.getName());
        return cartRepository.save(cart);
    }

    public Cart changeStatus(int cartId, CartStatus status) {
        Cart cart = getCart(cartId);
        if (cart == null) {
            throw new IllegalStateException(
                    String.format("Could not change status to %s "
                            + "since cart '%s' doesn't exists", status, cartId));
        }
        CartStatus oldStatus = cart.getStatus();
        cart.setStatus(status);

        log.debug("Changed {} status from '{}' to '{}'", cart,
                oldStatus, cart.getStatus());
        return cartRepository.save(cart);
    }

    public Cart getCart(int cartId) {
        return cartRepository.findById(cartId).orElse(null);
    }

    public void deleteCart(int cartId) {
        cartRepository.deleteById(cartId);
        log.debug("Cart {} successfully deleted", cartId);
    }

    public Cart addFriendToCart(Integer cartId, Integer friendId) {
        Cart cart = getCart(cartId);
        User friend = userService.getUser(friendId);

        boolean friendAlreadyInCart =
                cartRepository.existsByUsers_UserAndUsers_Cart(friend, cart);
        if (friendAlreadyInCart) {
            throw new IllegalStateException(
                    String.format("Could not add %s to %s since user is "
                            + "already in cart", friend, cart));
        }

        CartUsers participantUser = CartUsers.ofCartParticipant(cart, friend);
        cartUsersRepository.save(participantUser);

        log.info("{} added to {}", participantUser, cart);
        return cart;
    }
}
