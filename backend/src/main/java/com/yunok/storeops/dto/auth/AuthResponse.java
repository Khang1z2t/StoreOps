package com.yunok.storeops.dto.auth;

public record AuthResponse(
        String accessToken,
        String refreshToken
) {
}
