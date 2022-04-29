package com.rukkila.minimalistsocketcart.rest;

import com.rukkila.minimalistsocketcart.model.dto.CartSocketMessageContainer;
import com.rukkila.minimalistsocketcart.model.dto.ProductSocketMessageContainer;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@MessageMapping("/carts/{cartId}")
public class CartSocketController {

    @MessageMapping("/name-updated")
    @SendTo("/carts/{cartId}/name-updated-listener")
    public CartSocketMessageContainer catNameUpdatedMessageListener(
            @Payload CartSocketMessageContainer message) {
        return message;
    }

    @MessageMapping("/status-updated")
    @SendTo("/carts/{cartId}/status-updated-listener")
    public CartSocketMessageContainer catStatusUpdatedMessageListener(
            @Payload CartSocketMessageContainer message) {
        return message;
    }

    @MessageMapping("/deleted")
    @SendTo("/carts/{cartId}/deleted-listener")
    public CartSocketMessageContainer cartDeletedMessageListener(
            @Payload CartSocketMessageContainer message) {
        return message;
    }

    @MessageMapping("/products-added")
    @SendTo("/carts/{cartId}/products-added-listener")
    public ProductSocketMessageContainer productsAddedListener(
            @Payload ProductSocketMessageContainer message) {
        return message;
    }

    @MessageMapping("/product-removed")
    @SendTo("/carts/{cartId}/product-removed-listener")
    public ProductSocketMessageContainer productRemovedListener(
            @Payload ProductSocketMessageContainer message) {
        return message;
    }

    @MessageMapping("/product-modified")
    @SendTo("/carts/{cartId}/product-modified-listener")
    public ProductSocketMessageContainer productModifiedListener(
            @Payload ProductSocketMessageContainer message) {
        return message;
    }

    @MessageMapping("/product-moved")
    @SendTo("/carts/{cartId}/product-moved-listener")
    public ProductSocketMessageContainer productMovedListener(
            @Payload ProductSocketMessageContainer message) {
        return message;
    }
}
