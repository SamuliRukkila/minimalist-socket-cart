package com.rukkila.minimalistsocketcart.rest;

import java.util.List;

import javax.websocket.server.PathParam;

import com.rukkila.minimalistsocketcart.model.status.CartStatus;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;
import com.rukkila.minimalistsocketcart.service.CartService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<Cart>> getCarts() {
        List<Cart> carts = cartService.getCarts();
        return ResponseEntity.ok(carts);
    }

    @PostMapping
    public ResponseEntity<Cart> createCart(@RequestParam("name") String name) {
        Cart newCart = cartService.createCart(name);
        return ResponseEntity.ok(newCart);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCart(@PathVariable("id") Integer id) {
        Cart foundCart = cartService.getCart(id);
        return ResponseEntity.ok(foundCart);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable("id") Integer id) {
        cartService.deleteCart(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cart> updateCart(@PathVariable("id") Integer id,
                                           @RequestBody Cart cart) {
        Cart updatedCart = cartService.updateCart(id, cart);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/{id}/change-status")
    public ResponseEntity<Cart> updateCartStatus(
            @PathVariable("id") Integer id,
            @PathParam("status") CartStatus status) {
        Cart updatedCart = cartService.changeStatus(id, status);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/{cartId}/add-friend/{friendId}")
    public ResponseEntity<Cart> addFriendToCart(
            @PathVariable("cartId") Integer cartId,
            @PathVariable("friendId") Integer friendId) {
        Cart updatedCart = cartService.addFriendToCart(cartId, friendId);
        return ResponseEntity.ok(updatedCart);
    }
}
