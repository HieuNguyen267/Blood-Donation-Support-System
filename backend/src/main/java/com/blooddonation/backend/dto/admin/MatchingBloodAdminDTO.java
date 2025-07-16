package com.blooddonation.backend.dto.admin;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MatchingBloodAdminDTO {
    private Integer matchingId;
    private Integer requestId;
    private String hospitalName;
    private String donorName;
    private String requiredBloodGroup;
    private String donorBloodGroup;
    private LocalDateTime contactDate;
    private String status;
    private Integer quantityDonated;
    private String note;
    private BigDecimal distanceKm;
    private String fullName;
    private java.time.LocalDate dateOfBirth;
    private String phone;
    private String address;
    private String aboType;
    private String rhFactor;
    private Integer donorId;
    private Integer facilityId;
    private java.time.LocalDateTime notificationSentAt;
    private java.time.LocalDateTime responseTime;
    private java.time.LocalDateTime arrivalTime;
    private Integer quantityMl;
    private String notes;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    // Add more fields if needed
} 