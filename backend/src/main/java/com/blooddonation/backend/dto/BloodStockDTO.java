package com.blooddonation.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BloodStockDTO {
    private Integer stockId;
    private Integer eventId;
    private String eventName;
    private Integer bloodGroupId;
    private String bloodGroupName;
    private LocalDate collectionDate;
    private LocalDate expiryDate;
    private Integer volume;
    private String status;
    private String storageLocation;
    private String temperatureLog;
    private Boolean qualityCheckPassed;
    private LocalDate qualityCheckDate;
    private Integer qualityCheckStaffId;
    private String qualityCheckStaffName;
    private String qualityNotes;
    private Integer bloodRequestId;
    private LocalDate bloodRequestDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 