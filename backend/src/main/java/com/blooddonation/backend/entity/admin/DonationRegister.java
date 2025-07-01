package com.blooddonation.backend.entity.admin;

import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.common.Event;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Donation_Register")
@Data
public class DonationRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "register_id")
    private Integer registerId;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @Column(name = "pre_donation_survey", columnDefinition = "TEXT")
    private String preDonationSurvey;

    @Column(name = "health_check_result", columnDefinition = "TEXT")
    private String healthCheckResult;

    @Column(name = "quantity_ml")
    private Integer quantity;

    @Column(name = "donation_status", length = 20)
    private String donationStatus = "registered";

    @Column(length = 20)
    private String status = "scheduled";

    @Column(name = "staff_notes", columnDefinition = "TEXT")
    private String staffNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "time_slot", length = 20)
    private String timeSlot;

    public Integer getRegisterId() { return registerId; }
    public void setRegisterId(Integer registerId) { this.registerId = registerId; }

    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getPreDonationSurvey() { return preDonationSurvey; }
    public void setPreDonationSurvey(String preDonationSurvey) { this.preDonationSurvey = preDonationSurvey; }

    public String getHealthCheckResult() { return healthCheckResult; }
    public void setHealthCheckResult(String healthCheckResult) { this.healthCheckResult = healthCheckResult; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

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

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
} 