package com.blooddonation.backend.service.common;

import com.blooddonation.backend.service.common.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(String to, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("swp391.donateblood@gmail.com");
        message.setTo(to);
        message.setSubject("Xác thực email - Hệ thống Hiến máu");
        message.setText("Mã xác thực của bạn là: " + verificationCode + ". Mã này có hiệu lực trong 10 phút.");
        
        mailSender.send(message);
    }

    @Override
    public void sendPasswordResetEmail(String to, String resetCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("swp391.donateblood@gmail.com");
        message.setTo(to);
        message.setSubject("Đặt lại mật khẩu - Hệ thống Hiến máu");
        message.setText("Mã đặt lại mật khẩu của bạn là: " + resetCode + ". Mã này có hiệu lực trong 10 phút.");
        
        mailSender.send(message);
    }

    @Override
    public void sendDonationRegisterConfirmation(String to, String donorName, String date) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("swp391.donateblood@gmail.com");
        message.setTo(to);
        message.setSubject("Xác nhận đăng ký hiến máu");
        message.setText("Xin chào " + donorName + ",\nBạn đã đăng ký hiến máu thành công vào ngày " + date + ".\nCảm ơn bạn đã tham gia chương trình hiến máu!\nHệ thống Hỗ trợ Hiến máu");
        mailSender.send(message);
    }

    @Override
    public void sendAppointmentReminder(String to, String donorName, String date) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("swp391.donateblood@gmail.com");
        message.setTo(to);
        message.setSubject("Nhắc nhở cuộc hẹn hiến máu");
        message.setText("Xin chào " + donorName + ",\nNhắc nhở: Bạn có cuộc hẹn hiến máu vào ngày " + date + ".\nVui lòng đến đúng giờ và mang theo giấy tờ tùy thân.\nCảm ơn bạn!\nHệ thống Hỗ trợ Hiến máu");
        mailSender.send(message);
    }

    @Override
    public void sendPostDonationReminder(String to, String donorName) {
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
    }

    @Override
    public void sendRecoveryTimeReminder(String to, String donorName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("swp391.donateblood@gmail.com");
        message.setTo(to);
        message.setSubject("Đã đến lúc hiến máu lại");
        message.setText("Xin chào " + donorName + ",\nĐã 3 tháng kể từ lần hiến máu cuối của bạn. Bạn đã có thể hiến máu lại!\n" +
                "Hãy đăng ký hiến máu để tiếp tục cứu giúp những người cần máu.\nCảm ơn bạn đã tham gia chương trình hiến máu!\nHệ thống Hỗ trợ Hiến máu");
        mailSender.send(message);
    }
} 