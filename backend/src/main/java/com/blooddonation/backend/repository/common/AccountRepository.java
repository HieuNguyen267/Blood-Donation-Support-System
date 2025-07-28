package com.blooddonation.backend.repository.common;
import com.blooddonation.backend.entity.common.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
    Optional<Account> findByEmailOrPhone(String email, String phone);
    boolean existsByEmail(String email);
} 