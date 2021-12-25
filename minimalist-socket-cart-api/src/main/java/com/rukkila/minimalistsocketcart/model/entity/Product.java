package com.rukkila.minimalistsocketcart.model.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "is_collected", nullable = false)
    private boolean isCollected = false;

    @Column(nullable = false)
    private int amount = 1;

    @Column(name = "created_at", nullable = false)
    private Date createdAt = new Date();

    @JsonIgnore
    @ManyToOne
    @JoinColumn(
        nullable = false,
        name = "cart_id",
        foreignKey = @ForeignKey(name = "FK_cart_products"))
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Cart cart;

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

    public boolean isCollected() {
        return isCollected;
    }

    public void setCollected(boolean collected) {
        isCollected = collected;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }
}
