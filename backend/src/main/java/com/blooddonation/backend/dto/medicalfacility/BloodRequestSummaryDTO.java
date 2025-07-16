package com.blooddonation.backend.dto.medicalfacility;

import lombok.Data;

@Data
public class BloodRequestSummaryDTO {
    private int totalAccepted;
    private int totalAcceptedBlood;
    private int totalBloodFullfilled;
    private int totalBlood;
    private int quantityRequested;
    private int remainingNeeded;
    private int progressPercent;
} 