package com.blooddonation.backend.entity.common;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.blooddonation.backend.entity.admin.BloodRequest;
import com.blooddonation.backend.entity.donor.Donor;

@Entity
@Table(name = "Matching_Blood")
@Data
public class MatchingBlood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "matching_id")
    private Integer matchingId;

    @ManyToOne
    @JoinColumn(name = "request_id", nullable = false)
    private BloodRequest bloodRequest;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(name = "distance_km", precision = 6, scale = 2)
    private BigDecimal distanceKm;

    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;

    @Column(name = "donor_response", length = 20)
    private String donorResponse = "pending";

    @Column(name = "response_time")
    private LocalDateTime responseTime;

    @Column(name = "estimated_arrival_time")
    private LocalDateTime estimatedArrivalTime;

    @Column(name = "actual_arrival_time")
    private LocalDateTime actualArrivalTime;

    @Column(name = "donation_completed")
    private Boolean donationCompleted = false;

    @Column(name = "donation_completion_time")
    private LocalDateTime donationCompletionTime;

    @Column(name = "facility_confirmation")
    private Boolean facilityConfirmation = false;

    @Column(name = "facility_confirmation_time")
    private LocalDateTime facilityConfirmationTime;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Integer getMatchingId() { return matchingId; }
    public BloodRequest getBloodRequest() { return bloodRequest; }
    public Donor getDonor() { return donor; }
    public java.math.BigDecimal getDistanceKm() { return distanceKm; }
    public java.time.LocalDateTime getNotificationSentAt() { return notificationSentAt; }
    public String getDonorResponse() { return donorResponse; }
    public java.time.LocalDateTime getResponseTime() { return responseTime; }
    public java.time.LocalDateTime getEstimatedArrivalTime() { return estimatedArrivalTime; }
    public java.time.LocalDateTime getActualArrivalTime() { return actualArrivalTime; }
    public Boolean getDonationCompleted() { return donationCompleted; }
    public java.time.LocalDateTime getDonationCompletionTime() { return donationCompletionTime; }
    public Boolean getFacilityConfirmation() { return facilityConfirmation; }
    public java.time.LocalDateTime getFacilityConfirmationTime() { return facilityConfirmationTime; }
    public String getNotes() { return notes; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
} 