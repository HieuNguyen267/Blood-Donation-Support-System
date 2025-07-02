package com.blooddonation.backend.controller.common;

import com.blooddonation.backend.service.common.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "*")
public class ContactController {
    @Autowired
    private EmailService emailService;

    @Autowired
    private com.blooddonation.backend.repository.common.AccountRepository accountRepository;

    @PostMapping
    public ResponseEntity<?> sendContactMessage(@RequestBody Map<String, String> body) {
        System.out.println("Received contact request: " + body);
        String email = body.get("email");
        String message = body.get("message");
        if (email == null || message == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Thiếu thông tin"));
        }
        String subject = "[Liên hệ từ website] - " + email;
        String content = message;
        emailService.sendContactEmail("swp391.donateblood@gmail.com", subject, content, email);
        return ResponseEntity.ok(Map.of("message", "Gửi liên hệ thành công!"));
    }

    @GetMapping("/notification-status")
    public ResponseEntity<?> getEmailNotificationStatus(@RequestParam String email) {
        var acc = accountRepository.findByEmail(email);
        if (acc.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy tài khoản"));
        return ResponseEntity.ok(Map.of("emailNotificationEnabled", acc.get().getEmailNotificationEnabled()));
    }

    @PostMapping("/notification-status")
    public ResponseEntity<?> updateEmailNotificationStatus(@RequestBody Map<String, Object> body) {
        String email = (String) body.get("email");
        Boolean enabled = (Boolean) body.get("enabled");
        var accOpt = accountRepository.findByEmail(email);
        if (accOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy tài khoản"));
        var acc = accOpt.get();
        acc.setEmailNotificationEnabled(enabled);
        accountRepository.save(acc);
        return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công!", "emailNotificationEnabled", enabled));
    }
} 