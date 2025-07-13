package com.blooddonation.backend.entity.admin;

import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.common.Event;
import com.blooddonation.backend.entity.common.TimeEvent;
import com.blooddonation.backend.entity.donor.PreDonationSurvey;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "donation_register")
@Data
public class DonationRegister {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "register_id")
    private Integer registerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_id")
    private TimeEvent timeEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pre_donation_survey_id")
    private PreDonationSurvey preDonationSurvey;

    @Column(name = "health_check_result", columnDefinition = "TEXT")
    private String healthCheckResult;

    @Column(name = "quantity_ml")
    private Integer quantityMl;

    @Column(name = "weight_kg")
    private Integer weightKg;

    @Column(name = "donation_status", length = 20)
    private String donationStatus = "registered";

    @Column(name = "status", length = 20, nullable = false)
    private String status = "pending";

    @Column(name = "staff_notes", columnDefinition = "TEXT")
    private String staffNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getter và Setter methods
    public Integer getRegisterId() { return registerId; }
    public void setRegisterId(Integer registerId) { this.registerId = registerId; }

    public Donor getDonor() { return donor; }
    public void setDonor(Donor donor) { this.donor = donor; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public TimeEvent getTimeEvent() { return timeEvent; }
    public void setTimeEvent(TimeEvent timeEvent) { this.timeEvent = timeEvent; }

    public Staff getStaff() { return staff; }
    public void setStaff(Staff staff) { this.staff = staff; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public PreDonationSurvey getPreDonationSurvey() { return preDonationSurvey; }
    public void setPreDonationSurvey(PreDonationSurvey preDonationSurvey) { this.preDonationSurvey = preDonationSurvey; }

    public String getHealthCheckResult() { return healthCheckResult; }
    public void setHealthCheckResult(String healthCheckResult) { this.healthCheckResult = healthCheckResult; }

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
} 