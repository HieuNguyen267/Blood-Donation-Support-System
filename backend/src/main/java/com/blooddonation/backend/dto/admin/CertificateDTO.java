package com.blooddonation.backend.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateDTO {
    private Integer certificateId;
    private Integer donorId;
    private String donorName;
    private Integer registerId;
    private Integer matchingId;
    private String certificateNumber;
    private LocalDate donationDate;
    private Integer bloodVolume;
    private LocalDate issuedDate;
    private Integer issuedByStaffId;
    private String issuedByStaffName;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 