package com.rukkila.minimalistsocketcart.config;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.rukkila.minimalistsocketcart.service.UserService;
import com.rukkila.minimalistsocketcart.util.JwtTokenUtil;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtRequestFilter.class);

    private static final String SOCKET_COOKIE_ACCESS_TOKEN = "token_id";

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain chain) throws ServletException, IOException {

        String tokenHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.isNotBlank(tokenHeader) && tokenHeader.length() > 6) {
            tokenHeader = tokenHeader.substring(7);
        }
        else {
            tokenHeader = tryFindTokenFromCookies(request);
        }

        if (StringUtils.isNotBlank(tokenHeader)) {
            JwtTokenUtil jwtTokenUtil = new JwtTokenUtil(tokenHeader);

            try {
                String username = jwtTokenUtil.getUsernameFromToken();
                validateToken(jwtTokenUtil, username, chain, request, response);
            }
            catch (IllegalArgumentException e) {
                log.error("Unable to get JWT Token", e);
            }
            catch (ExpiredJwtException e) {
                log.error("JWT Token has expired", e);
            }
        }
        else {
            chain.doFilter(request, response);
        }
    }

    private String tryFindTokenFromCookies(
            HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (ArrayUtils.isEmpty(cookies)) {
            return null;
        }

        return Arrays.stream(cookies)
                .filter(cookie -> StringUtils.equals(
                        SOCKET_COOKIE_ACCESS_TOKEN, cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void validateToken(JwtTokenUtil jwtTokenUtil,
                               String username,
                               FilterChain chain,
                               HttpServletRequest request,
                               HttpServletResponse response)
            throws ServletException, IOException {

        // Once we get the token validate it
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userService.loadUserByUsername(username);

            // If token is valid configure Spring Security to manually set authentication
            if (userDetails != null && jwtTokenUtil.validateToken(userDetails)) {
                response.setHeader("username", username);

                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // After setting the Authentication in the context, we specify
                // that the current user is authenticated. So it passes the
                // Spring Security Configurations successfully.
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        chain.doFilter(request, response);
    }
}
