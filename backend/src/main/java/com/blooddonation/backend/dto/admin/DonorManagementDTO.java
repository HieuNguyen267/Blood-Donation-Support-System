package com.blooddonation.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DonorManagementDTO {
    
    private Long id;
    private String fullName;
    private String gender;
    private String phone;
    private String address;
    private String bloodGroup;
    private Integer age;
    private String email;
    private String lastDonationDate;
    private Integer totalDonations;
    private String isEligible; // "Có" hoặc "Không"
} 