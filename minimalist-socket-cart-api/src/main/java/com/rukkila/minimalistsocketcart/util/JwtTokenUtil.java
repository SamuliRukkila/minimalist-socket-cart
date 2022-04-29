package com.rukkila.minimalistsocketcart.util;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import com.rukkila.minimalistsocketcart.model.entity.User;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtTokenUtil {
    public static final String SECRET = "mysecret";

    private final String token;

    public JwtTokenUtil(String jwtToken) {
        this.token = jwtToken;
    }

    public String getToken() {
        return token;
    }

    public String getUsernameFromToken() {
        return getClaimFromToken(Claims::getSubject);
    }

    public Date getExpirationDateFromToken() {
        return getClaimFromToken(Claims::getExpiration);
    }


    public <T> T getClaimFromToken(Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken();
        return claimsResolver.apply(claims);
    }

    public static Integer getUserIdFromSecurity() {
        User user = (User) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        return user.getId();
    }

    public String getClaimFromTokenByName(String name) {
        final Claims claims = getAllClaimsFromToken();
        return (String)claims.get(name);
    }


    private Claims getAllClaimsFromToken() {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired() {
        final Date expiration = getExpirationDateFromToken();
        return expiration.before(new Date());
    }

    public static JwtTokenUtil generateToken(User user) {
        Map<String, Object> claims = addClaims(user);
        return doGenerateToken(claims, user.getUsername());
    }

    private static Map<String, Object> addClaims(User user) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("id", user.getId());

        return claims;
    }

    private static JwtTokenUtil doGenerateToken(Map<String, Object> claims,
                                                String subject) {
        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(createFutureDate(6))
                .signWith(SignatureAlgorithm.HS512, SECRET).compact();

        return new JwtTokenUtil(token);
    }

    private static Date createFutureDate(int months) {
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, months);
        return calendar.getTime();
    }

    public Boolean validateToken(UserDetails userDetails) {
        final String username = getUsernameFromToken();
        if (username == null) {
            return false;
        }
        return (username.equals(userDetails.getUsername()) && !isTokenExpired());
    }

    public Boolean validateToken() {
        return (!isTokenExpired());
    }
}
