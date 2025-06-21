package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Blood_Stock")
@Data
public class BloodStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_id")
    private Integer stockId;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "blood_group_id", nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "collection_date", nullable = false)
    private LocalDate collectionDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    private Integer volume;

    @Column(length = 20)
    private String status = "available";

    @Column(name = "storage_location", length = 50)
    private String storageLocation;

    @Column(name = "temperature_log", columnDefinition = "TEXT")
    private String temperatureLog;

    @Column(name = "quality_check_passed")
    private Boolean qualityCheckPassed = true;

    @Column(name = "quality_check_date")
    private LocalDate qualityCheckDate;

    @ManyToOne
    @JoinColumn(name = "quality_check_staff_id")
    private Staff qualityCheckStaff;

    @Column(name = "quality_notes", columnDefinition = "TEXT")
    private String qualityNotes;

    @Column(name = "blood_request_id")
    private Integer bloodRequestId;

    @Column(name = "blood_request_date")
    private LocalDate bloodRequestDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 