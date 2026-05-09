package com.caplatform.application.identity.service;

import com.caplatform.domain.identity.entity.User;
import com.caplatform.domain.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * User Application Service
 * Implements use cases for user management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserApplicationService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(String email, String password, String firstName, 
                          String lastName, String officeId) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("User with email " + email + " already exists");
        }

        String hashedPassword = passwordEncoder.encode(password);
        User user = new User(email, hashedPassword, firstName, lastName, officeId);
        User savedUser = userRepository.save(user);
        
        log.info("User created: {}", email);
        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public List<User> findAllActive() {
        return userRepository.findAllByIsActiveTrue();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deactivateUser(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setIsActive(false);
            userRepository.save(user);
            log.info("User deactivated: {}", userId);
        });
    }
}
