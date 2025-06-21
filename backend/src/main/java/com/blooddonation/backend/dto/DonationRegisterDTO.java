package com.blooddonation.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DonationRegisterDTO {
    private Integer registerId;
    private Integer donorId;
    private Integer eventId;
    private Integer staffId;
    private LocalDate appointmentDate;
    private String preDonationSurvey;
    private String healthCheckResult;
    private Integer quantityMl;
    private String donationStatus;
    private String status;
    private String staffNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 