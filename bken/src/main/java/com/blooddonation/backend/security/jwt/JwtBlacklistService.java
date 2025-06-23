package com.blooddonation.backend.security.jwt;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class JwtBlacklistService {
    
    private final ConcurrentMap<String, Long> blacklistedTokens = new ConcurrentHashMap<>();
    
    public void blacklistToken(String token) {
        blacklistedTokens.put(token, System.currentTimeMillis());
    }
    
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }
    
    public void cleanupExpiredTokens() {
        long currentTime = System.currentTimeMillis();
        blacklistedTokens.entrySet().removeIf(entry -> 
            currentTime - entry.getValue() > 24 * 60 * 60 * 1000); // 24 hours
    }
} 