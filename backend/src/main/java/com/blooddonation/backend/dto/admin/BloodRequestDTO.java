package com.blooddonation.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BloodRequestDTO {
    private Integer requestId;
    private String facilityName;
    private String bloodGroup; // A+, O-, ...
    private Integer quantityRequested;
    private String emergencyLevel; // "Khẩn cấp" hoặc "Bình thường"
    private String requiredBy; // ngày, giờ
    private String contactPerson;
    private String contactPhone;
    private String fullName; // người phụ trách
    private String deliveryPerson;
    private String specialRequirements;
    private String requestStatus; // "Chờ xác nhận", "Xác nhận", "Từ chối"
    private Boolean isEmergency;
    private String patientInfo;
    private Boolean isCompatible;
    private String processingStatus;
    private String notes;
    private String bloodFullfilled;
    private String emergencyStatus;
    private String facilityAddress;

    public BloodRequestDTO(
        Integer requestId,
        String facilityName,
        String facilityAddress,
        String bloodGroup,
        Integer quantityRequested,
        String emergencyLevel,
        String requiredBy,
        String contactPerson,
        String contactPhone,
        String fullName,
        String deliveryPerson,
        String specialRequirements,
        String requestStatus,
        Boolean isEmergency,
        String patientInfo,
        Boolean isCompatible,
        String processingStatus,
        String notes,
        String bloodFullfilled,
        String emergencyStatus
    ) {
        this.requestId = requestId;
        this.facilityName = facilityName;
        this.facilityAddress = facilityAddress;
        this.bloodGroup = bloodGroup;
        this.quantityRequested = quantityRequested;
        this.emergencyLevel = emergencyLevel;
        this.requiredBy = requiredBy;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
        this.fullName = fullName;
        this.deliveryPerson = deliveryPerson;
        this.specialRequirements = specialRequirements;
        this.requestStatus = requestStatus;
        this.isEmergency = isEmergency;
        this.patientInfo = patientInfo;
        this.isCompatible = isCompatible;
        this.processingStatus = processingStatus;
        this.notes = notes;
        this.bloodFullfilled = bloodFullfilled;
        this.emergencyStatus = emergencyStatus;
    }
} 