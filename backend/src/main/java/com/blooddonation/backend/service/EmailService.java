package com.blooddonation.backend.service;

public interface EmailService {
    void sendVerificationEmail(String to, String verificationCode);
    void sendPasswordResetEmail(String to, String resetCode);
    void sendDonationRegisterConfirmation(String to, String donorName, String date);
    void sendAppointmentReminder(String to, String donorName, String date);
    void sendPostDonationReminder(String to, String donorName);
    void sendRecoveryTimeReminder(String to, String donorName);
} 