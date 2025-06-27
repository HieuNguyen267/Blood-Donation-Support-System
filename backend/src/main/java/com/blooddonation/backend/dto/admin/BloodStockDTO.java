package com.blooddonation.backend.dto.admin;

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

    public Integer getStockId() { return stockId; }
    public void setStockId(Integer stockId) { this.stockId = stockId; }

    public Integer getEventId() { return eventId; }
    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public Integer getBloodGroupId() { return bloodGroupId; }
    public void setBloodGroupId(Integer bloodGroupId) { this.bloodGroupId = bloodGroupId; }

    public String getBloodGroupName() { return bloodGroupName; }
    public void setBloodGroupName(String bloodGroupName) { this.bloodGroupName = bloodGroupName; }

    public LocalDate getCollectionDate() { return collectionDate; }
    public void setCollectionDate(LocalDate collectionDate) { this.collectionDate = collectionDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Integer getVolume() { return volume; }
    public void setVolume(Integer volume) { this.volume = volume; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }

    public String getTemperatureLog() { return temperatureLog; }
    public void setTemperatureLog(String temperatureLog) { this.temperatureLog = temperatureLog; }

    public Boolean getQualityCheckPassed() { return qualityCheckPassed; }
    public void setQualityCheckPassed(Boolean qualityCheckPassed) { this.qualityCheckPassed = qualityCheckPassed; }

    public LocalDate getQualityCheckDate() { return qualityCheckDate; }
    public void setQualityCheckDate(LocalDate qualityCheckDate) { this.qualityCheckDate = qualityCheckDate; }

    public Integer getQualityCheckStaffId() { return qualityCheckStaffId; }
    public void setQualityCheckStaffId(Integer qualityCheckStaffId) { this.qualityCheckStaffId = qualityCheckStaffId; }

    public String getQualityCheckStaffName() { return qualityCheckStaffName; }
    public void setQualityCheckStaffName(String qualityCheckStaffName) { this.qualityCheckStaffName = qualityCheckStaffName; }

    public String getQualityNotes() { return qualityNotes; }
    public void setQualityNotes(String qualityNotes) { this.qualityNotes = qualityNotes; }

    public Integer getBloodRequestId() { return bloodRequestId; }
    public void setBloodRequestId(Integer bloodRequestId) { this.bloodRequestId = bloodRequestId; }

    public LocalDate getBloodRequestDate() { return bloodRequestDate; }
    public void setBloodRequestDate(LocalDate bloodRequestDate) { this.bloodRequestDate = bloodRequestDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 