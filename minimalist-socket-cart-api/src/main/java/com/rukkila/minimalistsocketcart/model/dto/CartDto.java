package com.rukkila.minimalistsocketcart.model.dto;

import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;
import com.rukkila.minimalistsocketcart.model.status.CartStatus;

public class CartDto {
    private Integer id;
    private String name;
    private CartStatus status;
    private Date createdAt;
    private Set<CartUserDTO> cartUsers;

    public CartDto() {}

    public CartDto(Cart cart) {
        this.id = cart.getId();
        this.name = cart.getName();
        this.status = cart.getStatus();
        this.createdAt = cart.getCreatedAt();
        this.cartUsers = cart.getUsers().stream()
                .map(cartUser -> {
                    User user = cartUser.getUser();
                    UserDTO userDTO = new UserDTO();
                    userDTO.setId(user.getId());
                    userDTO.setUsername(user.getUsername());

                    CartUserDTO cartUserDTO = new CartUserDTO();
                    cartUserDTO.setUser(userDTO);
                    cartUserDTO.setCartOwnership(cartUser.getCartOwnership());

                    return cartUserDTO;
                }).collect(Collectors.toSet());
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CartStatus getStatus() {
        return status;
    }

    public void setStatus(CartStatus status) {
        this.status = status;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Set<CartUserDTO> getCartUsers() {
        if (cartUsers == null) cartUsers = new HashSet<>();
        return cartUsers;
    }

    public void setCartUsers(Set<CartUserDTO> cartUsers) {
        this.cartUsers = cartUsers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CartDto)) return false;
        CartDto cartDTO = (CartDto) o;
        return Objects.equals(getId(), cartDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
