package com.rukkila.minimalistsocketcart.model.jwt;

import java.util.Date;

import com.rukkila.minimalistsocketcart.model.entity.User;

import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

public class JwtResponse {
    private final String token;
    private final User user;
    private final Date expirationDate;

    public JwtResponse(String token, User user, Date expirationDate) {
        this.token = token;
        this.user = user;
        this.expirationDate = expirationDate;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public String getToken() {
        return this.token;
    }

    public User getUser() {
        return user;
    }

    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }
}
