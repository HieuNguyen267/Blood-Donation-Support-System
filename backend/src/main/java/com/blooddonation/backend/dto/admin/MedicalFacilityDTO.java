package com.blooddonation.backend.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalFacilityDTO {
    private Long facilityId;
    private Integer accountId;
    private String facilityName;
    private String licenseNumber;
    private String address;
    private String phone;
    private String email;
    private String createdAt;
    private String updatedAt;
} 