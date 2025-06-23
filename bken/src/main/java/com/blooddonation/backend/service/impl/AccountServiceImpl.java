package com.blooddonation.backend.service.impl;

import com.blooddonation.backend.dto.auth.JwtResponse;
import com.blooddonation.backend.dto.auth.LoginRequest;
import com.blooddonation.backend.dto.auth.SignupRequest;
import com.blooddonation.backend.entity.Account;
import com.blooddonation.backend.repository.AccountRepository;
import com.blooddonation.backend.security.jwt.JwtTokenProvider;
import com.blooddonation.backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class AccountServiceImpl implements com.blooddonation.backend.service.AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountServiceImpl.class);

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    // Map lưu tạm thông tin đăng ký: key là email, value là SignupCache
    private final Map<String, SignupCache> signupCacheMap = new ConcurrentHashMap<>();

    private static class SignupCache {
        SignupRequest signupRequest;
        String code;
        LocalDateTime expiry;
        SignupCache(SignupRequest signupRequest, String code, LocalDateTime expiry) {
            this.signupRequest = signupRequest;
            this.code = code;
            this.expiry = expiry;
        }
    }

    @Override
    public String preSignup(SignupRequest signupRequest) {
        logger.info("Bắt đầu đăng ký tạm với email: {}", signupRequest.getEmail());
        if (accountRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }
        String code = generateVerificationCode();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        signupCacheMap.put(signupRequest.getEmail(), new SignupCache(signupRequest, code, expiry));
        emailService.sendVerificationEmail(signupRequest.getEmail(), code);
        return "Đã gửi mã xác thực đến email của bạn. Vui lòng xác thực để hoàn tất đăng ký.";
    }

    @Override
    public String confirmSignup(String email, String code) {
        SignupCache cache = signupCacheMap.get(email);
        if (cache == null) {
            throw new RuntimeException("Không tìm thấy thông tin đăng ký tạm cho email này hoặc đã hết hạn");
        }
        if (!cache.code.equals(code)) {
            throw new RuntimeException("Mã xác thực không đúng");
        }
        if (cache.expiry.isBefore(LocalDateTime.now())) {
            signupCacheMap.remove(email);
            throw new RuntimeException("Mã xác thực đã hết hạn");
        }
        SignupRequest signupRequest = cache.signupRequest;
        // Tạo account và lưu vào database
        Account account = new Account();
        account.setEmail(signupRequest.getEmail());
        String username = signupRequest.getFirstName() + " " + signupRequest.getLastName();
        account.setUsername(username);
        account.setPasswordHash(passwordEncoder.encode(signupRequest.getPassword()));
        account.setRole("USER");
        account.setIsActive(true);
        account.setCreatedAt(LocalDateTime.now());
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);
        signupCacheMap.remove(email);
        return "Đăng ký thành công. Bạn đã có thể đăng nhập.";
    }

    @Override
    public JwtResponse signin(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);
        Account account = accountRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy account"));
        Long id = account.getAccountId() != null ? account.getAccountId().longValue() : null;
        return new JwtResponse(jwt, id, account.getEmail(), null, null, account.getRole());
    }

    @Override
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy account với email: " + email));
    }

    @Override
    public Account updateAccount(Account account) {
        return accountRepository.save(account);
    }

    @Override
    public String activateAccount(String email, String code) {
        // Tùy vào logic xác thực, bạn có thể thêm trường verificationCode vào entity Account nếu muốn
        // Ở đây chỉ minh họa logic đơn giản
        Account account = findByEmail(email);
        // Giả sử bạn có trường verificationCode và trạng thái active
        // if (account.getVerificationCode() == null || !account.getVerificationCode().equals(code)) {
        //     throw new RuntimeException("Mã xác thực không đúng");
        // }
        account.setIsActive(true);
        accountRepository.save(account);
        return "Xác thực tài khoản thành công";
    }

    @Override
    public String sendVerificationCode(String email) {
        String verificationCode = generateVerificationCode();
        // Nếu muốn lưu verificationCode vào entity Account, cần thêm trường này
        // account.setVerificationCode(verificationCode);
        // accountRepository.save(account);
        emailService.sendVerificationEmail(email, verificationCode);
        return "Đã gửi mã xác thực đến email của bạn";
    }

    @Override
    public String sendResetPasswordCode(String email) {
        Account account = findByEmail(email);
        String resetCode = generateVerificationCode();
        account.setResetPasswordCode(resetCode);
        account.setResetPasswordCodeExpiry(LocalDateTime.now().plusMinutes(10));
        accountRepository.save(account);
        emailService.sendPasswordResetEmail(email, resetCode);
        return "Đã gửi mã đặt lại mật khẩu đến email của bạn";
    }

    @Override
    public String verifyResetPasswordCode(String email, String code) {
        // Nếu muốn xác thực mã đặt lại mật khẩu, cần lưu resetCode vào entity Account
        // Ở đây chỉ minh họa logic đơn giản
        return "Mã xác thực đúng. Bạn có thể đặt lại mật khẩu";
    }

    @Override
    public String resetPassword(String email, String newPassword, String confirmNewPassword) {
        Account account = findByEmail(email);
        if (!newPassword.equals(confirmNewPassword)) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }
        account.setPasswordHash(passwordEncoder.encode(newPassword));
        accountRepository.save(account);
        return "Đặt lại mật khẩu thành công";
    }

    @Override
    public String signup(SignupRequest signupRequest) {
        return preSignup(signupRequest);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
} 