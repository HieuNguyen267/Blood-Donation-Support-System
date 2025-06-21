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
} 