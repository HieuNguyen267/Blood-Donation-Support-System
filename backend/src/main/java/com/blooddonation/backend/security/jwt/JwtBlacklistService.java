package com.blooddonation.backend.security.jwt;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class JwtBlacklistService {
    
    private final ConcurrentMap<String, Integer> blacklistedTokens = new ConcurrentHashMap<>();
    
    public void blacklistToken(String token) {
        blacklistedTokens.put(token, (int) System.currentTimeMillis());
    }
    
    public boolean isBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }
    
    public void cleanupExpiredTokens() {
        int currentTime = (int) System.currentTimeMillis();
        blacklistedTokens.entrySet().removeIf(entry -> 
            currentTime - entry.getValue() > 24 * 60 * 60 * 1000); // 24 hours
    }
} 