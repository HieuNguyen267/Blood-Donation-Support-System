package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.LoginRequest;
import com.blooddonation.backend.dto.LoginResponse;
import com.blooddonation.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.blooddonation.backend.entity.Account;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Account account) {
        if (authService.existsByUsername(account.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        account.setPasswordHash(passwordEncoder.encode(account.getPasswordHash()));
        account.setIsActive(true);
        account.setRole("USER");
        account.setCreatedAt(java.time.LocalDateTime.now());
        account.setUpdatedAt(java.time.LocalDateTime.now());
        Account saved = authService.saveAccount(account);
        return ResponseEntity.ok(saved);
    }
} 