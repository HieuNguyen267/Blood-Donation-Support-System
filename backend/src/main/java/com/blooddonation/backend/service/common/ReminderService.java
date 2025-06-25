package com.blooddonation.backend.service.common;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ReminderService {
    void sendAppointmentReminders();
    void sendPostDonationReminders();
    void sendRecoveryTimeReminders();
    void sendExpiringStockReminders();
    void sendLowStockReminders();
    List<Map<String, Object>> getUpcomingReminders();
    void scheduleReminder(Integer donorId, String reminderType, LocalDate reminderDate);
} 