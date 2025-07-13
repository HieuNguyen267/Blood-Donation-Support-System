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
    // Add more fields if needed
} 