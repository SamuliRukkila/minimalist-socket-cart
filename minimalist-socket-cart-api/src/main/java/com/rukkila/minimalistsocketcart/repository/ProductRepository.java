package com.rukkila.minimalistsocketcart.repository;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.Product;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer> {
    List<Product> findProductByCart_id(int cartId);

    void deleteAllByCart_id(int cartId);

    long countByCart_id(int cartId);
}
