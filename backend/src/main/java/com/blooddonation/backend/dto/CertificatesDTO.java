package com.blooddonation.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CertificatesDTO {
    private Integer certificateId;
    private Integer donorId;
    private String donorName;
    private Integer registerId;
    private Integer matchingId;
    private String certificateNumber;
    private LocalDate donationDate;
    private Integer bloodVolume;
    private String donationLocation;
    private String milestoneType;
    private LocalDate issuedDate;
    private String issuedBy;
    private Integer issuedByStaffId;
    private String issuedByStaffName;
    private String digitalSignature;
    private String qrCode;
    private String verificationCode;
    private Boolean isVerified;
    private String certificateStatus;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public void setCertificateId(Integer certificateId) { this.certificateId = certificateId; }
    public void setDonorId(Integer donorId) { this.donorId = donorId; }
    public void setDonorName(String donorName) { this.donorName = donorName; }
    public void setRegisterId(Integer registerId) { this.registerId = registerId; }
    public void setMatchingId(Integer matchingId) { this.matchingId = matchingId; }
    public void setCertificateNumber(String certificateNumber) { this.certificateNumber = certificateNumber; }
    public void setDonationDate(LocalDate donationDate) { this.donationDate = donationDate; }
    public void setBloodVolume(Integer bloodVolume) { this.bloodVolume = bloodVolume; }
    public void setDonationLocation(String donationLocation) { this.donationLocation = donationLocation; }
    public void setMilestoneType(String milestoneType) { this.milestoneType = milestoneType; }
    public void setIssuedDate(LocalDate issuedDate) { this.issuedDate = issuedDate; }
    public void setIssuedBy(String issuedBy) { this.issuedBy = issuedBy; }
    public void setIssuedByStaffId(Integer issuedByStaffId) { this.issuedByStaffId = issuedByStaffId; }
    public void setIssuedByStaffName(String issuedByStaffName) { this.issuedByStaffName = issuedByStaffName; }
    public void setDigitalSignature(String digitalSignature) { this.digitalSignature = digitalSignature; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
    public void setCertificateStatus(String certificateStatus) { this.certificateStatus = certificateStatus; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 