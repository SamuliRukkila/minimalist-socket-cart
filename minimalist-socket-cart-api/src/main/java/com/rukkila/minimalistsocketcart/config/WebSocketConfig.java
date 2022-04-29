package com.rukkila.minimalistsocketcart.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Carry the messages back to the client on destinations prefixed
        // with “/ws”
//        config.enableSimpleBroker("/ws");
        // Designating the “/api” prefix to filter destinations targeting
        // application annotated methods (via @MessageMapping).
//        config.setApplicationDestinationPrefixes("/api");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/carts/*/connect")
                .setAllowedOrigins("http://localhost:4200");
        registry.addEndpoint("/ws/carts/*/connect")
                .setAllowedOrigins("http://localhost:4200")
                .withSockJS();
    }
}
