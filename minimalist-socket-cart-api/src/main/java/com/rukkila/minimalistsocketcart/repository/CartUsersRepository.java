package com.rukkila.minimalistsocketcart.repository;

import com.rukkila.minimalistsocketcart.model.entity.cart.CartUsers;
import com.rukkila.minimalistsocketcart.model.entity.cart.CartUsersKey;

import org.springframework.data.repository.CrudRepository;

public interface CartUsersRepository extends
        CrudRepository<CartUsers, CartUsersKey> {


}
