package com.rukkila.minimalistsocketcart.model.entity.cart;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rukkila.minimalistsocketcart.model.entity.Product;
import com.rukkila.minimalistsocketcart.model.status.CartStatus;

@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CartStatus status = CartStatus.CREATED;

    @OneToMany(mappedBy = "cart")
    private List<Product> products;

    @OneToMany(mappedBy = "cart")
    @JsonIgnore
    private Set<CartUsers> users;

    @Column(name = "created_at", nullable = false)
    private Date createdAt;

    protected Cart() {}

    public Cart(String name, CartStatus status) {
        this.name = name;
        this.createdAt = new Date();
        this.setStatus(status);
    }

    public static Cart ofCreated(String name) {
        return new Cart(name, CartStatus.CREATED);
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

    public List<Product> getProducts() {
        if (products == null) products = new ArrayList<>();
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public Set<CartUsers> getUsers() {
        if (users == null) users = new HashSet<>();
        return users;
    }

    public void setUsers(Set<CartUsers> cartUsers) {
        this.users = cartUsers;
    }

    public Date getCreatedAt() {
        if (createdAt == null) createdAt = new Date();
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Cart {" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", status=" + status +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Cart)) return false;
        Cart cart = (Cart) o;
        return getId().equals(cart.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    public static Cart of(Integer id) {
        Cart cart = new Cart();
        cart.setId(id);
        return cart;
    }
}
