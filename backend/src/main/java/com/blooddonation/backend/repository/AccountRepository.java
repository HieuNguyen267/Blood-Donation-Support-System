package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailOrPhone(String email, String phone);
    Optional<Account> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
} 