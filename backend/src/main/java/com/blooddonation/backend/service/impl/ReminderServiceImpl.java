package com.blooddonation.backend.service.impl;

import com.blooddonation.backend.entity.DonationRegister;
import com.blooddonation.backend.entity.Donor;
import com.blooddonation.backend.repository.DonationRegisterRepository;
import com.blooddonation.backend.repository.DonorRepository;
import com.blooddonation.backend.service.EmailService;
import com.blooddonation.backend.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReminderServiceImpl implements ReminderService {

    @Autowired
    private DonationRegisterRepository donationRegisterRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private EmailService emailService;

    @Override
    @Scheduled(cron = "0 0 8 * * *") // Chạy hàng ngày lúc 8h sáng
    public void sendAppointmentReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<DonationRegister> tomorrowAppointments = donationRegisterRepository.findByAppointmentDate(tomorrow);
        
        for (DonationRegister register : tomorrowAppointments) {
            Donor donor = register.getDonor();
            String email = getDonorEmail(donor);
            if (email != null) {
                emailService.sendAppointmentReminder(email, donor.getFullName(), tomorrow.toString());
            }
        }
    }

    @Override
    @Scheduled(cron = "0 0 10 * * *") // Chạy hàng ngày lúc 10h sáng
    public void sendPostDonationReminders() {
        LocalDate threeDaysAgo = LocalDate.now().minusDays(3);
        List<DonationRegister> recentDonations = donationRegisterRepository.findByDonationStatus("completed");
        
        for (DonationRegister register : recentDonations) {
            if (register.getCreatedAt().toLocalDate().equals(threeDaysAgo)) {
                Donor donor = register.getDonor();
                String email = getDonorEmail(donor);
                if (email != null) {
                    emailService.sendPostDonationReminder(email, donor.getFullName());
                }
            }
        }
    }

    @Override
    @Scheduled(cron = "0 0 9 * * *") // Chạy hàng ngày lúc 9h sáng
    public void sendRecoveryTimeReminders() {
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        List<DonationRegister> eligibleDonors = donationRegisterRepository.findByDonationStatus("completed");
        
        for (DonationRegister register : eligibleDonors) {
            if (register.getCreatedAt().toLocalDate().equals(threeMonthsAgo)) {
                Donor donor = register.getDonor();
                String email = getDonorEmail(donor);
                if (email != null) {
                    emailService.sendRecoveryTimeReminder(email, donor.getFullName());
                }
            }
        }
    }

    @Override
    @Scheduled(cron = "0 0 7 * * *") // Chạy hàng ngày lúc 7h sáng
    public void sendExpiringStockReminders() {
        // Gửi thông báo cho staff về máu sắp hết hạn
        LocalDate expiryDate = LocalDate.now().plusDays(7);
        // Implementation sẽ được thêm sau khi có Staff entity
    }

    @Override
    @Scheduled(cron = "0 0 6 * * *") // Chạy hàng ngày lúc 6h sáng
    public void sendLowStockReminders() {
        // Gửi thông báo cho staff về kho máu thấp
        // Implementation sẽ được thêm sau khi có Staff entity
    }

    @Override
    public List<Map<String, Object>> getUpcomingReminders() {
        List<Map<String, Object>> reminders = new ArrayList<>();
        
        // Lấy các cuộc hẹn trong 3 ngày tới
        for (int i = 1; i <= 3; i++) {
            LocalDate date = LocalDate.now().plusDays(i);
            List<DonationRegister> appointments = donationRegisterRepository.findByAppointmentDate(date);
            
            for (DonationRegister register : appointments) {
                Map<String, Object> reminder = new HashMap<>();
                reminder.put("donorId", register.getDonor().getDonorId());
                reminder.put("donorName", register.getDonor().getFullName());
                reminder.put("appointmentDate", date);
                reminder.put("reminderType", "appointment");
                reminder.put("daysUntil", i);
                reminders.add(reminder);
            }
        }
        
        return reminders;
    }

    @Override
    public void scheduleReminder(Integer donorId, String reminderType, LocalDate reminderDate) {
        // Lưu reminder vào database (có thể tạo thêm entity Reminder)
        // Implementation sẽ được thêm sau
    }

    private String getDonorEmail(Donor donor) {
        if (donor.getEmail() != null) {
            return donor.getEmail();
        }
        if (donor.getAccount() != null && donor.getAccount().getEmail() != null) {
            return donor.getAccount().getEmail();
        }
        return null;
    }
} 