package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.LoginRequest;
import com.blooddonation.backend.dto.LoginResponse;
import com.blooddonation.backend.entity.Account;
import com.blooddonation.backend.repository.AccountRepository;
import com.blooddonation.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AccountRepository accountRepository;

    public LoginResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            
            Account account = accountRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            return new LoginResponse(
                jwt,
                account.getUsername(),
                account.getRole(),
                account.getEmail()
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid username or password", e);
        }
    }

    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }
} 