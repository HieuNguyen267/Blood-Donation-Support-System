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

    public Integer getMatchingId() { return matchingId; }
    public void setMatchingId(Integer matchingId) { this.matchingId = matchingId; }
    public Integer getRequestId() { return requestId; }
    public void setRequestId(Integer requestId) { this.requestId = requestId; }
    public Integer getDonorId() { return donorId; }
    public void setDonorId(Integer donorId) { this.donorId = donorId; }
    public String getDonorName() { return donorName; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    public BigDecimal getDistanceKm() { return distanceKm; }
    public void setDistanceKm(BigDecimal distanceKm) { this.distanceKm = distanceKm; }
    public LocalDateTime getNotificationSentAt() { return notificationSentAt; }
    public void setNotificationSentAt(LocalDateTime notificationSentAt) { this.notificationSentAt = notificationSentAt; }
    public String getDonorResponse() { return donorResponse; }
    public void setDonorResponse(String donorResponse) { this.donorResponse = donorResponse; }
    public LocalDateTime getResponseTime() { return responseTime; }
    public void setResponseTime(LocalDateTime responseTime) { this.responseTime = responseTime; }
    public LocalDateTime getEstimatedArrivalTime() { return estimatedArrivalTime; }
    public void setEstimatedArrivalTime(LocalDateTime estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; }
    public LocalDateTime getActualArrivalTime() { return actualArrivalTime; }
    public void setActualArrivalTime(LocalDateTime actualArrivalTime) { this.actualArrivalTime = actualArrivalTime; }
    public Boolean getDonationCompleted() { return donationCompleted; }
    public void setDonationCompleted(Boolean donationCompleted) { this.donationCompleted = donationCompleted; }
    public LocalDateTime getDonationCompletionTime() { return donationCompletionTime; }
    public void setDonationCompletionTime(LocalDateTime donationCompletionTime) { this.donationCompletionTime = donationCompletionTime; }
    public Boolean getFacilityConfirmation() { return facilityConfirmation; }
    public void setFacilityConfirmation(Boolean facilityConfirmation) { this.facilityConfirmation = facilityConfirmation; }
    public LocalDateTime getFacilityConfirmationTime() { return facilityConfirmationTime; }
    public void setFacilityConfirmationTime(LocalDateTime facilityConfirmationTime) { this.facilityConfirmationTime = facilityConfirmationTime; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 