package com.rukkila.minimalistsocketcart.service;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.cart.Cart;
import com.rukkila.minimalistsocketcart.model.entity.Product;
import com.rukkila.minimalistsocketcart.repository.ProductRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    @Autowired
    private ProductRepository productRepository;

    public List<Product> addProductsToCart(List<Product> products,
                                           Integer cartId) {
        Cart cart = Cart.of(cartId);
        products.forEach(product -> product.setCart(cart));

        productRepository.saveAll(products);
        log.debug("{} product(s) added to cart '{}'", products.size(), cartId);

        return products;
    }

    public List<Product> getProducts(int cartId) {
        List<Product> products = productRepository.findProductByCart_id(cartId);

        if (log.isDebugEnabled()) {
            int amount = products.size();
            if (amount > 0) {
                log.debug("Found {} product(s) for cart id {}", products.size(), cartId);
            }
            else {
                log.debug("Found no products from cart {}", cartId);
            }
        }
        return products;
    }

    public Product updateProduct(int productId, Product product) {
        Product originalProduct = getProduct(productId);
        originalProduct.setName(product.getName());
        originalProduct.setAmount(product.getAmount());
        Product updatedProduct = productRepository.save(originalProduct);

        log.debug("Product {} updated. Name: '{}' Amount '{}'", productId,
                product.getName(), product.getAmount());
        return updatedProduct;
    }

    public void deleteProducts(int cartId) {
        productRepository.deleteAllByCart_id(cartId);
        log.debug("Deleted all the products via cart id: {}", cartId);
    }

    public void deleteProduct(int productId) {
        productRepository.deleteById(productId);
        log.debug("Product '{}' successfully deleted", productId);
    }

    public Product getProduct(int productId) {
        return productRepository.findById(productId).orElse(null);
    }

    public Product toggleIsProductCollected(int productId) {
        Product product = getProduct(productId);
        product.setCollected(!product.isCollected());

        Product updatedProduct = productRepository.save(product);

        if (log.isDebugEnabled()) {
            boolean isCollected = updatedProduct.isCollected();
            log.debug("Product '{}' (id={}) collected status changed from '{}' to '{}'",
                    product.getName(), productId, !isCollected, isCollected);
        }

        return updatedProduct;
    }

    public long getAmountOfProducts(int cartId) {
        return this.productRepository.countByCart_id(cartId);
    }
}
