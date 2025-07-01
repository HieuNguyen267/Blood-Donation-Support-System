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
    private String hospitalName;
    private String bloodType;

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
    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    public static MatchingBloodDTO fromEntity(com.blooddonation.backend.entity.common.MatchingBlood entity) {
        MatchingBloodDTO dto = new MatchingBloodDTO();
        dto.setMatchingId(entity.getMatchingId());
        dto.setRequestId(entity.getBloodRequest() != null ? entity.getBloodRequest().getRequestId() : null);
        dto.setDonorId(entity.getDonor() != null ? entity.getDonor().getDonorId() : null);
        dto.setDonorName(entity.getDonor() != null ? entity.getDonor().getFullName() : null);
        dto.setDistanceKm(entity.getDistanceKm());
        dto.setNotificationSentAt(entity.getNotificationSentAt());
        dto.setDonorResponse(entity.getDonorResponse());
        dto.setResponseTime(entity.getResponseTime());
        dto.setEstimatedArrivalTime(entity.getEstimatedArrivalTime());
        dto.setActualArrivalTime(entity.getActualArrivalTime());
        dto.setDonationCompleted(entity.getDonationCompleted());
        dto.setDonationCompletionTime(entity.getDonationCompletionTime());
        dto.setFacilityConfirmation(entity.getFacilityConfirmation());
        dto.setFacilityConfirmationTime(entity.getFacilityConfirmationTime());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setHospitalName(
            entity.getBloodRequest() != null && entity.getBloodRequest().getFacility() != null
                ? entity.getBloodRequest().getFacility().getFacilityName()
                : null
        );
        dto.setBloodType(
            entity.getDonor() != null && entity.getDonor().getBloodGroup() != null
                ? entity.getDonor().getBloodGroup().getAboType() + entity.getDonor().getBloodGroup().getRhFactor()
                : null
        );
        return dto;
    }

    public com.blooddonation.backend.entity.common.MatchingBlood toEntity() {
        com.blooddonation.backend.entity.common.MatchingBlood entity = new com.blooddonation.backend.entity.common.MatchingBlood();
        entity.setMatchingId(this.getMatchingId());
        entity.setDistanceKm(this.getDistanceKm());
        entity.setNotificationSentAt(this.getNotificationSentAt());
        entity.setDonorResponse(this.getDonorResponse());
        entity.setResponseTime(this.getResponseTime());
        entity.setEstimatedArrivalTime(this.getEstimatedArrivalTime());
        entity.setActualArrivalTime(this.getActualArrivalTime());
        entity.setDonationCompleted(this.getDonationCompleted());
        entity.setDonationCompletionTime(this.getDonationCompletionTime());
        entity.setFacilityConfirmation(this.getFacilityConfirmation());
        entity.setFacilityConfirmationTime(this.getFacilityConfirmationTime());
        entity.setNotes(this.getNotes());
        entity.setCreatedAt(this.getCreatedAt());
        entity.setUpdatedAt(this.getUpdatedAt());
        return entity;
    }
} 