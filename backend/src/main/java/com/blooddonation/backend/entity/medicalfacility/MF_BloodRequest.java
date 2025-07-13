package com.blooddonation.backend.entity.medicalfacility;

import com.blooddonation.backend.entity.admin.BloodGroup;
import com.blooddonation.backend.entity.admin.MedicalFacility;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_request")
@Data
public class MF_BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Integer requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_id", nullable = false)
    private MedicalFacility facility;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blood_group_id", nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "quantity_requested", nullable = false)
    private Integer quantityRequested;

    @Column(name = "is_emergency", nullable = false)
    private Boolean isEmergency = false;

    @Column(name = "patient_info", columnDefinition = "TEXT")
    private String patientInfo;

    @Column(name = "is_compatible", nullable = false)
    private Boolean isCompatible = true;

    @Column(name = "required_by", nullable = false)
    private LocalDateTime requiredBy;

    @Column(name = "blood_fullfilled", length = 100)
    private String bloodFullfilled;

    @Column(name = "request_status", length = 30, nullable = false)
    private String requestStatus = "pending";

    @Column(name = "processing_status", length = 30)
    private String processingStatus;

    @Column(name = "emergency_status", length = 30)
    private String emergencyStatus;

    @Column(name = "special_requirements", columnDefinition = "TEXT")
    private String specialRequirements;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "delivery_person", length = 100)
    private String deliveryPerson;

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

    // Thêm các getter/setter mapping cho service sử dụng
    public Integer getId() {
        return requestId;
    }
    public void setId(Integer id) {
        this.requestId = id;
    }
    public Integer getFacilityId() {
        return facility != null ? facility.getFacilityId().intValue() : null;
    }
    public void setFacilityId(Integer facilityId) {
        if (facility == null) facility = new MedicalFacility();
        facility.setFacilityId(facilityId.longValue());
    }
    public Integer getBloodGroupId() {
        return bloodGroup != null ? bloodGroup.getBloodGroupId() : null;
    }
    public void setBloodGroupId(Integer bloodGroupId) {
        if (bloodGroup == null) bloodGroup = new BloodGroup();
        bloodGroup.setBloodGroupId(bloodGroupId);
    }
    public Integer getQuantity() {
        return quantityRequested;
    }
    public void setQuantity(Integer quantity) {
        this.quantityRequested = quantity;
    }
    public String getCompatibilityRequirement() {
        return specialRequirements;
    }
    public void setCompatibilityRequirement(String compatibilityRequirement) {
        this.specialRequirements = compatibilityRequirement;
    }
    public LocalDateTime getRequiredBy() {
        return requiredBy;
    }
    public void setRequiredBy(LocalDateTime requiredBy) {
        this.requiredBy = requiredBy;
    }
} 