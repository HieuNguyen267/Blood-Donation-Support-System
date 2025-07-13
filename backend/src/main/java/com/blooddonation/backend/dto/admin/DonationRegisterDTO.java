package com.blooddonation.backend.dto.admin;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.blooddonation.backend.dto.donor.PreDonationSurveyDTO;

@Data
public class DonationRegisterDTO {
    private Integer registerId;
    private Integer donorId;
    private Integer eventId;
    private Integer timeId; // Thêm trường timeId
    private Integer staffId;
    private LocalDate appointmentDate;
    private PreDonationSurveyDTO preDonationSurvey;
    private String healthCheckResult;
    private Integer quantity;
    private Integer quantityMl; // Thêm trường này để phù hợp với frontend
    private Integer weightKg; // Thêm trường cân nặng
    private String donationStatus;
    private String status;
    private String staffNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String donorName;
    private String bloodGroup;
    private String phone;
    private String email;
    private String address;
    private String eventName;
    private String eventLocation;
    private String timeSlot;

    public Integer getRegisterId() { return registerId; }
    public void setRegisterId(Integer registerId) { this.registerId = registerId; }

    public Integer getDonorId() { return donorId; }
    public void setDonorId(Integer donorId) { this.donorId = donorId; }

    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public Integer getTimeId() { return timeId; }
    public void setTimeId(Integer timeId) { this.timeId = timeId; }

    public Integer getStaffId() { return staffId; }
    public void setStaffId(Integer staffId) { this.staffId = staffId; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public PreDonationSurveyDTO getPreDonationSurvey() { return preDonationSurvey; }
    public void setPreDonationSurvey(PreDonationSurveyDTO preDonationSurvey) { this.preDonationSurvey = preDonationSurvey; }

    public String getHealthCheckResult() { return healthCheckResult; }
    public void setHealthCheckResult(String healthCheckResult) { this.healthCheckResult = healthCheckResult; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Integer getQuantityMl() { return quantityMl; }
    public void setQuantityMl(Integer quantityMl) { this.quantityMl = quantityMl; }

    public Integer getWeightKg() { return weightKg; }
    public void setWeightKg(Integer weightKg) { this.weightKg = weightKg; }

    public String getDonationStatus() { return donationStatus; }
    public void setDonationStatus(String donationStatus) { this.donationStatus = donationStatus; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStaffNotes() { return staffNotes; }
    public void setStaffNotes(String staffNotes) { this.staffNotes = staffNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }

    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public String getEventLocation() { return eventLocation; }
    public void setEventLocation(String eventLocation) { this.eventLocation = eventLocation; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
} 