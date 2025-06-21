package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Blood_Request")
@Data
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @ManyToOne
    @JoinColumn(name = "facility_id", nullable = false)
    private MedicalFacilities facility;

    @ManyToOne
    @JoinColumn(name = "blood_group_id", nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "quantity_requested", nullable = false)
    private Integer quantityRequested;

    @Column(name = "urgency_level", nullable = false, length = 20)
    private String urgencyLevel;

    @Column(name = "patient_info", columnDefinition = "TEXT")
    private String patientInfo;

    @Column(name = "required_by", nullable = false)
    private LocalDateTime requiredBy;

    @Column(name = "quantity_fulfilled")
    private Integer quantityFulfilled = 0;

    @Column(name = "request_status", length = 30)
    private String requestStatus = "pending";

    @Column(name = "special_requirements", columnDefinition = "TEXT")
    private String specialRequirements;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "stock_id")
    private Integer stockId;

    @Column(name = "delivery_person", length = 100)
    private String deliveryPerson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 