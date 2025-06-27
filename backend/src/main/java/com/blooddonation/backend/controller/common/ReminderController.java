package com.blooddonation.backend.controller.common;

import com.blooddonation.backend.service.common.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reminders")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @GetMapping("/upcoming")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingReminders() {
        List<Map<String, Object>> reminders = reminderService.getUpcomingReminders();
        return ResponseEntity.ok(reminders);
    }

    @PostMapping("/schedule")
    public ResponseEntity<Void> scheduleReminder(
            @RequestParam Integer donorId,
            @RequestParam String reminderType,
            @RequestParam LocalDate reminderDate) {
        reminderService.scheduleReminder(donorId, reminderType, reminderDate);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-appointment")
    public ResponseEntity<Void> sendAppointmentReminders() {
        reminderService.sendAppointmentReminders();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-post-donation")
    public ResponseEntity<Void> sendPostDonationReminders() {
        reminderService.sendPostDonationReminders();
        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-recovery")
    public ResponseEntity<Void> sendRecoveryTimeReminders() {
        reminderService.sendRecoveryTimeReminders();
        return ResponseEntity.ok().build();
    }
} 