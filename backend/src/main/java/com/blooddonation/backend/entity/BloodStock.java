package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Blood_Stock")
@Data
public class BloodStock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "stock_id")
    private Integer stockId;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "blood_group_id", nullable = false)
    private BloodGroup bloodGroup;

    @Column(name = "collection_date", nullable = false)
    private LocalDate collectionDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(nullable = false)
    private Integer volume;

    @Column(length = 20)
    private String status = "available";

    @Column(name = "storage_location", length = 50)
    private String storageLocation;

    @Column(name = "temperature_log", columnDefinition = "TEXT")
    private String temperatureLog;

    @Column(name = "quality_check_passed")
    private Boolean qualityCheckPassed = true;

    @Column(name = "quality_check_date")
    private LocalDate qualityCheckDate;

    @ManyToOne
    @JoinColumn(name = "quality_check_staff_id")
    private Staff qualityCheckStaff;

    @Column(name = "quality_notes", columnDefinition = "TEXT")
    private String qualityNotes;

    @Column(name = "blood_request_id")
    private Integer bloodRequestId;

    @Column(name = "blood_request_date")
    private LocalDate bloodRequestDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Integer getStockId() { return stockId; }
    public void setStockId(Integer stockId) { this.stockId = stockId; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }

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

    public Staff getQualityCheckStaff() { return qualityCheckStaff; }
    public void setQualityCheckStaff(Staff qualityCheckStaff) { this.qualityCheckStaff = qualityCheckStaff; }

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