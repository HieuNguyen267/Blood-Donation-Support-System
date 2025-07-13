package com.blooddonation.backend.entity.common;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "matching_blood")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchingBlood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "matching_id")
    private Integer matchingId;

    @Column(name = "request_id", nullable = false)
    private Integer requestId;

    @Column(name = "donor_id", nullable = false)
    private Integer donorId;

    @Column(name = "facility_id", nullable = false)
    private Integer facilityId;

    @Column(name = "distance_km")
    private BigDecimal distanceKm;

    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "response_time")
    private LocalDateTime responseTime;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "quantity_ml")
    private Integer quantityMl;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 