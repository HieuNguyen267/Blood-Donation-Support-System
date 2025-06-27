package com.blooddonation.backend.service.auth;

import com.blooddonation.backend.dto.auth.LoginRequest;
import com.blooddonation.backend.dto.auth.JwtResponse;
import com.blooddonation.backend.entity.common.Account;
import com.blooddonation.backend.repository.common.AccountRepository;
import com.blooddonation.backend.security.jwt.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final AccountRepository accountRepository;

    public AuthService(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
            AccountRepository accountRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.accountRepository = accountRepository;
    }

    public JwtResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            Account account = accountRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return new JwtResponse(
                    jwt,
                    account.getAccountId(),
                    account.getEmail(),
                    null, // firstName nếu có
                    null, // lastName nếu có
                    account.getRole());
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password", e);
        }
    }

    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }

    public Account saveAccount(Account account) {
        return accountRepository.save(account);
    }
}