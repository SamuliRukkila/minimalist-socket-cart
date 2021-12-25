package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends CrudRepository<Cart, Integer> {

    List<Cart> findByUsers_User(User user, Sort sort);

    List<Cart> findByUsers_UserAndUsers_Cart(User user, Cart cart);

    boolean existsByUsers_UserAndUsers_Cart(User user, Cart cart);
}
