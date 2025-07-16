package com.blooddonation.backend.dto.medicalfacility;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MatchingBloodFacilityDTO {
    private Integer matchingId;
    private Integer requestId;
    private Integer donorId;
    private Integer facilityId;
    private BigDecimal distanceKm;
    private LocalDateTime notificationSentAt;
    private String status;
    private LocalDateTime responseTime;
    private LocalDateTime arrivalTime;
    private Integer quantityMl;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thông tin donor và nhóm máu
    private String fullName;
    private java.time.LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String aboType;
    private String rhFactor;
} 