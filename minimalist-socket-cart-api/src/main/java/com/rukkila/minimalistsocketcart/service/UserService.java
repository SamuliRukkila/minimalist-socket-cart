package com.rukkila.minimalistsocketcart.service;

import java.util.List;

import com.rukkila.minimalistsocketcart.model.entity.User;
import com.rukkila.minimalistsocketcart.repository.UserRepository;
import com.rukkila.minimalistsocketcart.util.CommonUtils;
import com.rukkila.minimalistsocketcart.util.JwtTokenUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        return userRepository.findUserByUsername(username);
    }

    public List<User> findUsers() {
        User user = getCurrentLoggedUser();
        List<User> foundUsers = userRepository.findAllByIdNot(user.getId());

        if (log.isDebugEnabled()) {
            if (foundUsers.isEmpty()) {
                log.debug("Did not find any other users when "
                        + "called by: {}", user);
            }
            else {
                log.debug("Found {} users when called by: {}",
                        foundUsers.size(), user);
            }
        }
        return foundUsers;
    }

    public List<User> findAllNonFriendUsers() {
        User user = getCurrentLoggedUser();

        List<User> foundUsers = findAllNonFriendUsers(user);

        if (log.isDebugEnabled()) {
            if (foundUsers.isEmpty()) {
                log.debug("Did not find any non-friend "
                        + "users when called by {}", user);
            }
            else {
                log.debug("Found {} non-friend users when called "
                        + "by {}", foundUsers.size(), user);
            }
        }
        return foundUsers;
    }

    public List<User> findNonFriendUsersByUsernameSearchWord(
            String usernameSearchWord) {
        User user = getCurrentLoggedUser();

        List<User> foundUsers = findAllNonFriendUsersWithUsername(
                user, usernameSearchWord);

        if (log.isDebugEnabled()) {
            if (foundUsers.isEmpty()) {
                log.debug("Could not find any non-friend users containing "
                        + "the username '{}'", usernameSearchWord);
            }
            else {
                log.debug("Found {} non-friend users with username of: '{}'",
                        foundUsers.size(), usernameSearchWord);
            }
        }

        return foundUsers;
    }

    public User getCurrentLoggedUser() {
        return getUser(JwtTokenUtil.getUserIdFromSecurity());
    }

    public User getUser(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> findAllNonFriendUsers(User user) {
        return findAllNonFriendUsersWithUsername(user, "");
    }

    public List<User> findAllNonFriendUsersWithUsername(
            User user, String usernameSearchWord) {
        usernameSearchWord =
                CommonUtils.toLowerCaseAndAppendWildCard(usernameSearchWord);
        return userRepository
                .findNonFriendUsersContainingUsernameSearchWord(
                        user.getId(), usernameSearchWord);
    }

    public User saveUser(String username, String password) {
        User user = User.of(username, password);
        return userRepository.save(user);
    }

    public boolean userAlreadyExists(String username) {
        boolean usernameAlreadyInUse = loadUserByUsername(username) != null;
        log.debug("Username '{}' is {} in use",
                username, usernameAlreadyInUse ? "" : "not");
        return usernameAlreadyInUse;
    }
}
