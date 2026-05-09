package com.caplatform.application.identity.dto;

import lombok.*;

/**
 * DTOs for User/Authentication operations
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String userId;
    private String email;
    private String fullName;
    private String token;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String officeId;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private String fullName;
    private String officeId;
    private boolean isActive;
}
