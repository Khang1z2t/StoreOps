package com.yunok.storeops.service.impl;

import com.yunok.storeops.dto.auth.AuthResponse;
import com.yunok.storeops.dto.auth.AuthUserResponse;
import com.yunok.storeops.dto.auth.LoginRequest;
import com.yunok.storeops.dto.auth.RegisterRequest;
import com.yunok.storeops.entity.User;
import com.yunok.storeops.repository.UserRepository;
import com.yunok.storeops.security.JwtUtil;
import com.yunok.storeops.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.identifier(), request.password())
        );

        User user = resolveUser(authentication.getPrincipal());
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken);
    }

    @Override
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(User.Role.USER)
                .active(true)
                .build();

        userRepository.save(user);
    }

    @Override
    public void logout() {
        // Add token to blacklist or invalidate it in the database/cache
    }

    @Override
    public AuthUserResponse me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new IllegalArgumentException("Authentication not found");
        }

        User user = resolveUser(authentication.getPrincipal());
        return AuthUserResponse.from(user);
    }

    private User resolveUser(Object principal) {
        if (principal instanceof User user) {
            return user;
        }

        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByUsernameOrEmail(userDetails.getUsername(), userDetails.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        }

        if (principal instanceof String value) {
            try {
                UUID userId = UUID.fromString(value);
                return userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
            } catch (IllegalArgumentException ignored) {
                return userRepository.findByUsernameOrEmail(value, value)
                        .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
            }
        }

        throw new IllegalArgumentException("Invalid authentication principal");
    }
}
