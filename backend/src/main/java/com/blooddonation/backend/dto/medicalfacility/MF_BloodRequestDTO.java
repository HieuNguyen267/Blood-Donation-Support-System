package com.blooddonation.backend.dto.medicalfacility;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MF_BloodRequestDTO {
    private Integer id;
    private Integer facilityId;
    private Integer bloodGroupId;
    private Integer quantityRequested;
    private String requestStatus;
    private String compatibilityRequirement;
    private LocalDateTime requiredBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Thêm các trường cho yêu cầu khẩn cấp
    private Boolean isEmergency;
    private String patientInfo;
    private Boolean isCompatible;
    private String bloodFullfilled;
    private String processingStatus;
    private String emergencyStatus;
    private String specialRequirements;
    private String contactPerson;
    private String contactPhone;
    private String notes;
    private String deliveryPerson;
    private String facilityName;
    private String facilityAddress;
    private String facilityPhone;
    private String facilityEmail;
    private String bloodGroupAboType;
    private String bloodGroupRhFactor;
} 