package com.blooddonation.backend.service;
import com.blooddonation.backend.dto.auth.JwtResponse;
import com.blooddonation.backend.dto.auth.LoginRequest;
import com.blooddonation.backend.dto.auth.SignupRequest;
import com.blooddonation.backend.entity.common.Account;

public interface AccountService {
    // Đăng ký account mới
    String signup(SignupRequest signupRequest);
    // Đăng nhập
    JwtResponse signin(LoginRequest loginRequest);
    // Tìm account theo email
    Account findByEmail(String email);
    // Cập nhật account
    Account updateAccount(Account account);
    // Kích hoạt tài khoản
    String activateAccount(String email, String code);
    // Gửi mã xác thực
    String sendVerificationCode(String email);
    // Gửi mã đặt lại mật khẩu
    String sendResetPasswordCode(String email);
    // Xác thực mã đặt lại mật khẩu
    String verifyResetPasswordCode(String email, String code);
    // Đặt lại mật khẩu
    String resetPassword(String email, String newPassword, String confirmNewPassword);
    // Đăng ký lưu tạm
    String preSignup(SignupRequest signupRequest);
    // Xác thực và lưu vào database
    String confirmSignup(String email, String code);
    String changePassword(String email, String oldPassword, String newPassword, String confirmNewPassword);
    void deleteAccount(String email);
} 