package com.blooddonation.backend.service.common;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(String to, String verificationCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject("Xác thực email - Hệ thống Hiến máu");
            message.setText("Mã xác thực của bạn là: " + verificationCode + ". Mã này có hiệu lực trong 10 phút.");
            
            mailSender.send(message);
            logger.info("Verification email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending verification email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email xác thực: " + e.getMessage());
        }
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject("Đặt lại mật khẩu - Hệ thống Hiến máu");
            message.setText("Mã đặt lại mật khẩu của bạn là: " + resetCode + ". Mã này có hiệu lực trong 10 phút.");
            
            mailSender.send(message);
            logger.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending password reset email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email đặt lại mật khẩu: " + e.getMessage());
        }
    }

    @Override
    public void sendDonationRegisterConfirmation(String to, String donorName, String date) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject("Xác nhận đăng ký hiến máu");
            message.setText("Xin chào " + donorName + ",\nBạn đã đăng ký hiến máu thành công vào ngày " + date + ".\nCảm ơn bạn đã tham gia chương trình hiến máu!\nHệ thống Hỗ trợ Hiến máu");
            mailSender.send(message);
            logger.info("Donation confirmation email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending donation confirmation email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email xác nhận hiến máu: " + e.getMessage());
        }
    }

    @Override
    public void sendAppointmentReminder(String to, String donorName, String date) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject("Nhắc nhở cuộc hẹn hiến máu");
            message.setText("Xin chào " + donorName + ",\nNhắc nhở: Bạn có cuộc hẹn hiến máu vào ngày " + date + ".\nVui lòng đến đúng giờ và mang theo giấy tờ tùy thân.\nCảm ơn bạn!\nHệ thống Hỗ trợ Hiến máu");
            mailSender.send(message);
            logger.info("Appointment reminder email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending appointment reminder email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email nhắc nhở cuộc hẹn: " + e.getMessage());
        }
    }

    @Override
    public void sendPostDonationReminder(String to, String donorName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject("Chăm sóc sau hiến máu");
            message.setText("Xin chào " + donorName + ",\nCảm ơn bạn đã hiến máu! Đây là một số lưu ý để chăm sóc sức khỏe sau hiến máu:\n\n" +
                    "1. Nghỉ ngơi đầy đủ\n" +
                    "2. Uống nhiều nước\n" +
                    "3. Ăn uống đầy đủ dinh dưỡng\n" +
                    "4. Tránh vận động mạnh trong 24h đầu\n\n" +
                    "Nếu có dấu hiệu bất thường, vui lòng liên hệ bác sĩ.\nHệ thống Hỗ trợ Hiến máu");
            mailSender.send(message);
            logger.info("Post donation reminder email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending post donation reminder email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email chăm sóc sau hiến máu: " + e.getMessage());
        }
    }

    @Override
    public void sendRecoveryTimeReminder(String to, String donorName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject("Đã đến lúc hiến máu lại");
            message.setText("Xin chào " + donorName + ",\nĐã 3 tháng kể từ lần hiến máu cuối của bạn. Bạn đã có thể hiến máu lại!\n" +
                    "Hãy đăng ký hiến máu để tiếp tục cứu giúp những người cần máu.\nCảm ơn bạn đã tham gia chương trình hiến máu!\nHệ thống Hỗ trợ Hiến máu");
            mailSender.send(message);
            logger.info("Recovery time reminder email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending recovery time reminder email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email nhắc nhở hiến máu lại: " + e.getMessage());
        }
    }

    @Override
    public void sendContactEmail(String to, String subject, String content, String replyTo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            message.setReplyTo(replyTo);
            mailSender.send(message);
            logger.info("Contact email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending contact email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Không thể gửi email liên hệ: " + e.getMessage());
        }
    }

    @Override
    public void sendEmergencyBloodRequestEmail(String to, String donorName, String detailUrl, String facilityName, String bloodGroup, String quantity, String requiredBy) {
        try {
            logger.info("Sending emergency blood request email to: {} for donor: {}", to, donorName);
            
            // Log email details for debugging
            logger.info("=== EMERGENCY EMAIL DETAILS ===");
            logger.info("To: {}", to);
            logger.info("Donor: {}", donorName);
            logger.info("Facility: {}", facilityName);
            logger.info("Blood Group: {}", bloodGroup);
            logger.info("Quantity: {}", quantity);
            logger.info("Required By: {}", requiredBy);
            logger.info("Detail URL: {}", detailUrl);
            logger.info("=== END EMAIL DETAILS ===");
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("swp391.donateblood@gmail.com");
            message.setTo(to);
            message.setSubject("Yêu cầu hiến máu khẩn cấp - Hệ thống Hiến máu");
            
            String emailContent = String.format(
                "Xin chào %s,\n\n" +
                "Có một yêu cầu hiến máu khẩn cấp cần sự hỗ trợ của bạn:\n\n" +
                "Thông tin yêu cầu:\n" +
                "- Cơ sở y tế: %s\n" +
                "- Nhóm máu cần: %s\n" +
                "- Số lượng cần: %s ml\n" +
                "- Ngày cần: %s\n\n" +
                "Vui lòng xem chi tiết và phản hồi qua đường dẫn sau:\n" +
                "%s\n\n" +
                "Cảm ơn bạn đã tham gia chương trình hiến máu!\n" +
                "Hệ thống Hỗ trợ Hiến máu",
                donorName, facilityName, bloodGroup, quantity, requiredBy, detailUrl
            );
            
            message.setText(emailContent);
            mailSender.send(message);
            
            logger.info("Emergency blood request email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending emergency blood request email to {}: {}", to, e.getMessage(), e);
            
            // Check if it's an authentication error
            if (e.getMessage().contains("Authentication failed") || e.getMessage().contains("BadCredentials")) {
                throw new RuntimeException("Lỗi xác thực email: Vui lòng kiểm tra cấu hình SMTP. Chi tiết: " + e.getMessage());
            } else {
                throw new RuntimeException("Không thể gửi email yêu cầu hiến máu khẩn cấp: " + e.getMessage());
            }
        }
    }
} 