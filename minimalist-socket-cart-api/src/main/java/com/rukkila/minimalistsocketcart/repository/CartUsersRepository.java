package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.model.entity.cart.CartUser;
import com.rukkila.minimalistsocketcart.model.entity.cart.CartUsersKey;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface CartUsersRepository extends CrudRepository<CartUser, CartUsersKey> {

    @Query("SELECT cu.user FROM CartUser cu WHERE "
            + "cu.cart.id = :cart_id AND cu.user <> :exclude_user")
    List<User> findUsersByCartId(@Param("exclude_user") User excludeUser,
                                 @Param("cart_id") Integer cartId);
}
