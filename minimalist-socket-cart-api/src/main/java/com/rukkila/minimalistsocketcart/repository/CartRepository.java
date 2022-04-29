package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.dto.CartDto;
import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;

import org.springframework.data.domain.Sort;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends CrudRepository<Cart, Integer> {

    List<CartDto> findAllByUsers_user(User user, Sort sort);

    CartDto getCartById(Integer id);

    List<Cart> findByUsers_UserAndUsers_Cart(User user, Cart cart);

    boolean existsByUsers_UserAndUsers_Cart(User user, Cart cart);
}
