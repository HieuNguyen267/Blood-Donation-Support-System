package com.blooddonation.backend.controller.auth;

import com.blooddonation.backend.dto.auth.*;
import com.blooddonation.backend.security.jwt.JwtTokenProvider;
import com.blooddonation.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Auth API hoạt động bình thường");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        try {
            String message = accountService.signup(signupRequest);
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = accountService.signin(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            String type = request.get("type");
            String message;
            if ("signup".equalsIgnoreCase(type)) {
                message = accountService.confirmSignup(email, code);
            } else if ("reset".equalsIgnoreCase(type)) {
                message = accountService.verifyResetPasswordCode(email, code);
            } else {
                throw new RuntimeException("Type không hợp lệ. Chỉ chấp nhận 'signup' hoặc 'reset'.");
            }
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> request) {
        try {
            String message = accountService.sendVerificationCode(request.get("email"));
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        try {
            String message = accountService.sendResetPasswordCode(forgotPasswordRequest.getEmail());
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        try {
            String message = accountService.resetPassword(
                resetPasswordRequest.getEmail(), 
                resetPasswordRequest.getNewPassword(),
                resetPasswordRequest.getConfirmNewPassword()
            );
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);
                jwtTokenProvider.invalidateToken(token);
                
                Map<String, String> response = new HashMap<>();
                response.put("message", "Đăng xuất thành công");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Token không hợp lệ");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String type = request.get("type");
            String message;
            if ("signup".equalsIgnoreCase(type)) {
                SignupRequest signupRequest = new SignupRequest();
                signupRequest.setEmail(email);
                message = accountService.preSignup(signupRequest);
            } else if ("reset".equalsIgnoreCase(type)) {
                message = accountService.sendResetPasswordCode(email);
            } else {
                throw new RuntimeException("Type không hợp lệ. Chỉ chấp nhận 'signup' hoặc 'reset'.");
            }
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        accountService.deleteAccount(email);
        return ResponseEntity.ok(Map.of("message", "Tài khoản đã bị xóa!"));
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> body,
            org.springframework.security.core.Authentication authentication) {
        String email = authentication.getName();
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        String confirmNewPassword = body.get("confirmNewPassword");
        try {
            String message = accountService.changePassword(email, oldPassword, newPassword, confirmNewPassword);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
} 