package com.yunok.storeops.controller;

import com.yunok.storeops.constants.ApiPaths;
import com.yunok.storeops.dto.ApiResponse;
import com.yunok.storeops.dto.auth.AuthResponse;
import com.yunok.storeops.dto.auth.AuthUserResponse;
import com.yunok.storeops.dto.auth.LoginRequest;
import com.yunok.storeops.dto.auth.RegisterRequest;
import com.yunok.storeops.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiPaths.API_AUTH)
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping(ApiPaths.AUTH_LOGIN)
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping(ApiPaths.AUTH_REGISTER)
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Register successful"));
    }

    @PostMapping(ApiPaths.AUTH_REFRESH)
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@RequestHeader("Authorization") String authHeader) {
        // Extract refresh token from "Bearer <token>" format
        String refreshToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        AuthResponse authResponse = authService.refresh(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed", authResponse));
    }

    @PostMapping(ApiPaths.AUTH_LOGOUT)
    public ResponseEntity<ApiResponse<Void>> logout() {
        authService.logout();
        return ResponseEntity.ok(ApiResponse.success("Logout successful"));
    }

    @GetMapping(ApiPaths.AUTH_ME)
    public ResponseEntity<ApiResponse<AuthUserResponse>> me() {
        return ResponseEntity.ok(ApiResponse.success("Get authenticated user successful", authService.me()));
    }
}
