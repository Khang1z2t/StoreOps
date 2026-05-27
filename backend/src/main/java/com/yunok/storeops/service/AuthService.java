package com.yunok.storeops.service;

import com.yunok.storeops.dto.auth.AuthResponse;
import com.yunok.storeops.dto.auth.AuthUserResponse;
import com.yunok.storeops.dto.auth.LoginRequest;
import com.yunok.storeops.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse login(LoginRequest request);

    void register(RegisterRequest request);

    void logout();

    AuthUserResponse me();
}
