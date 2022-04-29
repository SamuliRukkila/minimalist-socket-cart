package com.rukkila.minimalistsocketcart.rest;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.Product;
import com.rukkila.minimalistsocketcart.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam("cartId") Integer cartId) {
        List<Product> products = this.productService.getProducts(cartId);
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<List<Product>> addProducts(
            @RequestParam Integer cartId,
            @RequestBody List<Product> products) {
        List<Product> newProducts =
                productService.addProductsToCart(products, cartId);
        return ResponseEntity.ok(newProducts);
    }

    @PutMapping("/{id}/collected/toggle")
    public ResponseEntity<Product> toggleIsProductCollected(
            @PathVariable("id") Integer productId) {
        Product updatedProduct = productService.toggleIsProductCollected(productId);
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable("id") Integer productId,
            @RequestBody Product product) {
        Product updatedProduct =
                productService.updateProduct(productId, product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Integer productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/amount")
    public ResponseEntity<Integer> getAmountOfProducts(
            @RequestParam("cartId") Integer cartId) {
        int amount = productService.getAmountOfProducts(cartId);
        return ResponseEntity.ok(amount);
    }

    @PutMapping("change-index")
    public ResponseEntity<List<Product>> changeProductsIndex(
            @RequestParam("productId") Integer productId,
            @RequestParam("cartId") Integer cartId,
            @RequestParam("previousIndex") Integer previousIndex,
            @RequestParam("newIndex") Integer newIndex) {
        List<Product> reIndexedProducts =
                productService.changeProductIndex(
                        productId, cartId, previousIndex, newIndex);
        return ResponseEntity.ok(reIndexedProducts);
    }
}
