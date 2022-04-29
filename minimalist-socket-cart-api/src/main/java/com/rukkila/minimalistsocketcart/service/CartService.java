package com.rukkila.minimalistsocketcart.service;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.dto.CartDto;
import com.rukkila.minimalistsocketcart.model.dto.CartUserDTO;
import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;
import com.rukkila.minimalistsocketcart.model.entity.cart.CartOwnership;
import com.rukkila.minimalistsocketcart.model.entity.cart.CartUser;
import com.rukkila.minimalistsocketcart.model.status.CartStatus;
import com.rukkila.minimalistsocketcart.repository.CartRepository;
import com.rukkila.minimalistsocketcart.repository.CartUsersRepository;
import com.rukkila.minimalistsocketcart.util.JwtTokenUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
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

    public List<CartDto> getCarts() {
        User user = userService.getCurrentLoggedUser();
        List<CartDto> carts = cartRepository.findAllByUsers_user(
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

        CartUser cartUser = CartUser.ofCartOwner(createdCart, user);
        cartUsersRepository.save(cartUser);

        log.debug("{} created a new {}", user, createdCart);
        return createdCart;
    }

    public Cart updateCart(int cartId, Cart updatedCart) {
        Cart cart = getCart(cartId);

        checkPermissionsToCartAction(cart, false);

        String oldName = cart.getName();
        cart.setName(updatedCart.getName());

        log.debug("Cart's {} name updated from '{}' to '{}'", cart.getId(),
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

        checkPermissionsToCartAction(cart, false);

        CartStatus oldStatus = cart.getStatus();
        cart.setStatus(status);

        log.debug("Changed {} status from '{}' to '{}'", cart,
                oldStatus, cart.getStatus());
        return cartRepository.save(cart);
    }

    public CartDto getCartDTO(int cartId) {
        CartDto cart = cartRepository.getCartById(cartId);
        checkPermissionsToCartAction(cart, false);
        return cart;
    }

    public Cart getCart(int cartId) {
        Cart cart = cartRepository.findById(cartId).orElse(null);
        checkPermissionsToCartAction(cart, false);
        return cart;
    }

    public void deleteCart(int cartId) {
        Cart cart = getCart(cartId);
        if (cart == null) {
            throw new IllegalStateException(
                    String.format("Could not delete cart '%s' since "
                    + "it doesn't exist", cartId));
        }

        checkPermissionsToCartAction(cart, true);

        cartRepository.deleteById(cartId);
        log.info("Cart {} was successfully deleted by userId: {}",
                cartId, JwtTokenUtil.getUserIdFromSecurity());
    }

    public Cart addFriendToCart(Integer cartId, Integer friendId) {
        Cart cart = getCart(cartId);
        if (cart == null) {
            throw new IllegalStateException(
                    String.format("Could not add friend '%s' to cart '%s' "
                            + "since cart doesn't exist", friendId, cartId));
        }
        checkPermissionsToCartAction(cart, true);

        User friend = userService.getUser(friendId);

        boolean friendAlreadyInCart =
                cartRepository.existsByUsers_UserAndUsers_Cart(friend, cart);
        if (friendAlreadyInCart) {
            throw new IllegalStateException(
                    String.format("Could not add %s to %s since user is "
                            + "already in cart", friend, cart));
        }

        CartUser participantUser = CartUser.ofCartParticipant(cart, friend);
        cartUsersRepository.save(participantUser);

        log.info("{} added to {}", participantUser, cart);
        return cart;
    }

    public void checkPermissionsToCartAction(int cartId,
                                             boolean checkForOwnerRole) {
        checkPermissionsToCartAction(
                new CartDto(getCart(cartId)), checkForOwnerRole);
    }

    public void checkPermissionsToCartAction(Cart cart,
                                             boolean checkForOwnerRole) {
        if (cart == null) {
            return;
        }
        checkPermissionsToCartAction(new CartDto(cart), checkForOwnerRole);
    }

    public void checkPermissionsToCartAction(CartDto cartDTO,
                                             boolean checkForOwnerRole) {
        if (cartDTO == null) {
            return;
        }

        User currentUser = userService.getCurrentLoggedUser();
        int currentUserId = currentUser.getId();

        CartUserDTO foundCartUser = cartDTO.getCartUsers().stream()
                .filter(cartUser -> cartUser.getUser().getId().equals(currentUserId))
                .findFirst()
                .orElseThrow(() -> {
                    log.warn("{} tried to access cartId '{}' while not "
                            + "being part of the cart",
                            currentUser, cartDTO.getId());
                    return new AccessDeniedException("Access denied");
                });

        if (checkForOwnerRole) {
            if (foundCartUser.getCartOwnership() != CartOwnership.OWNER) {
                log.warn("{} tried to do owner-type actions to cartId '{}' "
                        + "while not being owner", currentUser, cartDTO.getId());
                throw new AccessDeniedException("Access denied");
            }
        }
    }
}
