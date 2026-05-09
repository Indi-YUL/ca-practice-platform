package com.caplatform.ui.controller;

import com.caplatform.application.identity.dto.UserResponse;
import com.caplatform.application.identity.service.UserApplicationService;
import com.caplatform.domain.identity.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * User REST Controller - Identity bounded context
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserApplicationService userApplicationService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userApplicationService.findAllActive();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable String id) {
        return userApplicationService.findById(id)
                .map(user -> ResponseEntity.ok(mapToResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        return userApplicationService.findByEmail(email)
                .map(user -> ResponseEntity.ok(mapToResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String id, @RequestBody User user) {
        return userApplicationService.findById(id)
                .map(existingUser -> {
                    user.setId(id);
                    User updated = userApplicationService.updateUser(user);
                    return ResponseEntity.ok(mapToResponse(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deactivateUser(@PathVariable String id) {
        userApplicationService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getOfficeId(),
                user.isEnabled()
        );
    }
}
