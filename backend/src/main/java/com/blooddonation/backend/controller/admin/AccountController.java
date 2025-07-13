package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.entity.common.Account;
import com.blooddonation.backend.repository.common.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/accounts")
@CrossOrigin(origins = "*")
public class AccountController {
    @Autowired
    private AccountRepository accountRepository;

    // Lấy danh sách tất cả tài khoản
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    // Lấy thông tin tài khoản theo id
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Integer id) {
        Optional<Account> account = accountRepository.findById(id);
        return account.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Thêm tài khoản mới
    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        // Có thể cần kiểm tra trùng email/username ở đây
        Account saved = accountRepository.save(account);
        return ResponseEntity.ok(saved);
    }

    // Sửa thông tin tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        Optional<Account> optional = accountRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Account account = optional.get();
        if (updates.containsKey("is_active")) {
            Object value = updates.get("is_active");
            if (value instanceof Boolean) {
                account.setIsActive((Boolean) value);
            } else if (value instanceof String) {
                account.setIsActive(Boolean.parseBoolean((String) value));
            }
        }
        Account updated = accountRepository.save(account);
        return ResponseEntity.ok(updated);
    }

    // Xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Integer id) {
        if (!accountRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        accountRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
} 