package com.blooddonation.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BloodRequestDTO {
    private Integer requestId;
    private Integer facilityId;
    private String facilityName;
    private Integer bloodGroupId;
    private String bloodGroupName;
    private Integer quantityRequested;
    private String urgencyLevel;
    private String patientInfo;
    private LocalDateTime requiredBy;
    private Integer quantityFulfilled;
    private String requestStatus;
    private String specialRequirements;
    private String contactPerson;
    private String contactPhone;
    private String notes;
    private Integer stockId;
    private String deliveryPerson;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 