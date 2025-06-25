package com.blooddonation.backend.dto.common;

import  lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MatchingBloodDTO {
    private Integer matchingId;
    private Integer requestId;
    private Integer donorId;
    private String donorName;
    private BigDecimal distanceKm;
    private LocalDateTime notificationSentAt;
    private String donorResponse;
    private LocalDateTime responseTime;
    private LocalDateTime estimatedArrivalTime;
    private LocalDateTime actualArrivalTime;
    private Boolean donationCompleted;
    private LocalDateTime donationCompletionTime;
    private Boolean facilityConfirmation;
    private LocalDateTime facilityConfirmationTime;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 