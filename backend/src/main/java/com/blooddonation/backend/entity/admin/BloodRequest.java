package com.blooddonation.backend.entity.admin;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_request")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private MedicalFacility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private Staff staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_group_id", nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "quantity_requested", nullable = false)
    private Integer quantityRequested;

    @Column(name = "is_emergency", nullable = false)
    private Boolean isEmergency = false;

    public Boolean getIsEmergency() {
        return isEmergency;
    }
    public void setIsEmergency(Boolean isEmergency) {
        this.isEmergency = isEmergency;
    }

    @Column(name = "patient_info")
    private String patientInfo;

    @Column(name = "is_compatible", nullable = false)
    private Boolean isCompatible = true;

    @Column(name = "required_by", nullable = false)
    private LocalDateTime requiredBy;

    @Column(name = "quantity_fulfilled")
    private Integer quantityFulfilled = 0;

    @Column(name = "request_status", nullable = false)
    private String requestStatus = "pending";

    @Column(name = "processing_status")
    private String processingStatus;

    @Column(name = "emergency_status")
    private String emergencyStatus;

    @Column(name = "special_requirements")
    private String specialRequirements;

    @Column(name = "contact_person")
    private String contactPerson;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "notes")
    private String notes;

    @Column(name = "stock_id")
    private Integer stockId;

    @Column(name = "delivery_person")
    private String deliveryPerson;

    @Column(name = "blood_fullfilled")
    private String bloodFullfilled;

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