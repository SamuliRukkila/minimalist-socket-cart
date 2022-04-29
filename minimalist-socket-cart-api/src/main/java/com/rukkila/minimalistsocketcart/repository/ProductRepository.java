package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.Product;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {
    List<Product> findProductsByCart_idOrderByIndex(int cartId);

    void deleteAllByCart_id(int cartId);

    int countByCart_id(int cartId);

    @Query("SELECT max(p.index) FROM Product p where p.cart.id = :cart_id")
    Integer getHighestIndexValueByCart_id(@Param("cart_id") Integer cartId);
}
