package com.yunok.storeops.dto.auth;

import com.yunok.storeops.entity.User;

import java.util.UUID;

public record AuthUserResponse(
        UUID id,
        String username,
        String email,
        String fullName,
        User.Role role,
        Boolean active
) {
    public static AuthUserResponse from(User user) {
        return new AuthUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.getActive()
        );
    }
}
