package com.yunok.storeops.security;

import com.yunok.storeops.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    // ── Access Token ─────────────────────────────

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        User user = (User) userDetails;

        extraClaims.put("fullName", user.getFullName());
        extraClaims.put("email", user.getEmail());
        extraClaims.put("role", user.getRole().name());
        extraClaims.put("type", "access");

        Map<String, Object> header = new HashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");
        header.put("kid", "storeops-2026");

        return Jwts.builder()
                .header().add(header).and()
                .claims(extraClaims)
                .subject(user.getId().toString())
                .issuer("StoreOps")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    // ── Refresh Token ─────────────────────────────

    public String generateRefreshToken(UserDetails userDetails) {
        User user = (User) userDetails;

        // Refresh token giữ claims tối thiểu — chỉ cần đủ để gen access token mới
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");

        return Jwts.builder()
                .claims(claims)
                .subject(user.getId().toString())
                .issuer("StoreOps")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(getSignInKey())
                .compact();
    }

    // ── Validation ────────────────────────────────

    public boolean isTokenValid(String token, UserDetails userDetails) {
        User user = (User) userDetails;
        return extractUserId(token).equals(user.getId().toString())
                && !isTokenExpired(token)
                && isAccessToken(token);        // tránh dùng refresh token như access token
    }

    public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        User user = (User) userDetails;
        return extractUserId(token).equals(user.getId().toString())
                && !isTokenExpired(token)
                && isRefreshToken(token);
    }

    // ── Extract ───────────────────────────────────

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    private boolean isAccessToken(String token) {
        return "access".equals(extractClaim(token, c -> c.get("type", String.class)));
    }

    private boolean isRefreshToken(String token) {
        return "refresh".equals(extractClaim(token, c -> c.get("type", String.class)));
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        try {
            byte[] decoded = Decoders.BASE64.decode(secret);
            // Base64 decode thành công và đủ dài (>= 32 bytes cho HS256)
            if (decoded.length >= 32) {
                return Keys.hmacShaKeyFor(decoded);
            }
        } catch (Exception ignored) {
            // Không phải Base64 hợp lệ → fallback sang plain string
        }
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
