package com.blooddonation.backend.entity;

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
    private Integer quantityMl;

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
} 