package com.blooddonation.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MedicalFacilitiesDTO {
    private Integer facilityId;
    private Integer accountId;
    private String facilityName;
    private String facilityType;
    private String licenseNumber;
    private String address;
    private String phone;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 