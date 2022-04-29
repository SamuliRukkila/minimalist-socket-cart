package com.rukkila.minimalistsocketcart.service;

import java.util.List;

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
    @Autowired
    private CartService cartService;

    public List<Product> addProductsToCart(List<Product> products,
                                           Integer cartId) {
        cartService.checkPermissionsToCartAction(cartId, false);

        Integer highestPreviousProductIndex =
                productRepository.getHighestIndexValueByCart_id(cartId);
        if (highestPreviousProductIndex == null) {
            highestPreviousProductIndex = 0;
        }

        for (Product newProduct : products) {
            newProduct.setCart(cartId);
            newProduct.setIndex(highestPreviousProductIndex++);
            validateAmountValue(newProduct);
        }

        productRepository.saveAll(products);
        log.debug("{} product(s) added to cart '{}'", products.size(), cartId);

        return products;
    }

    public List<Product> getProducts(int cartId) {
        cartService.checkPermissionsToCartAction(cartId, false);

        List<Product> products =
                productRepository.findProductsByCart_idOrderByIndex(cartId);

        if (log.isDebugEnabled()) {
            int amount = products.size();
            if (amount > 0) {
                log.debug("Found {} product(s) for cart {}", products.size(), cartId);
            }
            else {
                log.debug("Found no products from cart {}", cartId);
            }
        }
        return products;
    }

    public Product updateProduct(int productId, Product product) {
        Product originalProduct = getProduct(productId);

        checkPermissionsToProductAction(originalProduct);

        originalProduct.setName(product.getName());
        originalProduct.setAmount(product.getAmount());

        validateAmountValue(product);

        Product updatedProduct = productRepository.save(originalProduct);

        log.debug("Product {} updated. Name: '{}' Amount '{}'", productId,
                product.getName(), product.getAmount());
        return updatedProduct;
    }

    private void validateAmountValue(Product product) {
        if (product.getAmount() < 1) {
            product.setAmount(1);
        }
        else if (product.getAmount() > 99) {
            product.setAmount(99);
        }
    }
    
    public void deleteProducts(int cartId) {
        cartService.checkPermissionsToCartAction(cartId, false);

        productRepository.deleteAllByCart_id(cartId);
        log.debug("Deleted all the products via cart id: {}", cartId);
    }

    public void deleteProduct(int productId) {
        checkPermissionsToProductAction(productId);

        productRepository.deleteById(productId);
        log.debug("Product '{}' successfully deleted", productId);
    }

    public Product getProduct(int productId) {
        return productRepository.findById(productId).orElse(null);
    }

    public Product toggleIsProductCollected(int productId) {
        Product product = getProduct(productId);

        checkPermissionsToProductAction(product);

        product.setCollected(!product.isCollected());

        Product updatedProduct = productRepository.save(product);

        if (log.isDebugEnabled()) {
            boolean isCollected = updatedProduct.isCollected();
            log.debug("Product '{}' collected status changed from '{}' to '{}'",
                    product, !isCollected, isCollected);
        }

        return updatedProduct;
    }

    public int getAmountOfProducts(int cartId) {
        cartService.checkPermissionsToCartAction(cartId, false);

        return this.productRepository.countByCart_id(cartId);
    }

    public List<Product> changeProductIndex(Integer productId,
                                            Integer cartId,
                                            Integer previousIndex,
                                            Integer newIndex) {
        checkPermissionsToProductAction(productId);

        List<Product> products = getProducts(cartId);

        Product movedProduct = products.stream()
                .filter(product -> product.getId().equals(productId))
                .findFirst().orElse(null);

        if (movedProduct == null) {
            throw new IllegalStateException(
                    String.format("Could not change product's index since it "
                            + "wasn't found. CartId: %s. ProductId: %s",
                            cartId, productId));
        }

        products.remove(movedProduct);
        products.add(newIndex, movedProduct);

        for (int i = 0; i < products.size(); i++) {
            products.get(i).setIndex(i);
        }

        log.info("Successfully changed {} index value from '{}' to '{}'. "
                        + "{} other product-indexes were also updated",
                movedProduct, previousIndex, movedProduct.getIndex(),
                products.size() - 1);

        this.productRepository.saveAll(products);
        return products;
    }

    private void checkPermissionsToProductAction(Integer productId) {
        checkPermissionsToProductAction(getProduct(productId));
    }

    private void checkPermissionsToProductAction(Product product) {
        cartService.checkPermissionsToCartAction(
                product.getCart().getId(), false);
    }
}
