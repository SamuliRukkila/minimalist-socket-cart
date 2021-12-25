package com.rukkila.minimalistsocketcart.service;

import java.util.Date;

import com.rukkila.minimalistsocketcart.model.jwt.JwtRequest;
import com.rukkila.minimalistsocketcart.model.jwt.JwtResponse;
import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.util.JwtTokenUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public JwtResponse login(@RequestBody JwtRequest request) throws Exception {
        final User user = authenticate(request);
        log.debug("{} successfully authenticated", user);
        return generateJwtResponse(user);
    }

    public JwtResponse register(@RequestBody JwtRequest request) {
        String username = request.getUsername();
        if (userService.userAlreadyExists(username)) {
            log.warn("Trying to register with already taken username '{}'", username);
            return null;
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User newUser = userService.saveUser(username, encodedPassword);

        log.debug("New {} registered", newUser);
        return generateJwtResponse(newUser);
    }

    private User authenticate(JwtRequest request) throws Exception {
        final User user;

        try {
            String username = request.getUsername();
            String password = request.getPassword();

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password));
            user = (User) auth.getPrincipal();
        }
        catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
        return user;
    }

    private JwtResponse generateJwtResponse(User user) {
        final JwtTokenUtil jwtTokenUtil = JwtTokenUtil.generateToken(user);
        final String token = jwtTokenUtil.getToken();
        Date expirationDate = jwtTokenUtil.getExpirationDateFromToken();

        return new JwtResponse(token, user, expirationDate);
    }
}
