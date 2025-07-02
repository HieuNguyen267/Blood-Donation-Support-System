package com.blooddonation.backend.dto.common;

import lombok.Data;

@Data
public class EmergencyRequestDTO {
    private String requesterName;
    private String bloodGroup;
    private Integer quantity;
    private String phone;
    private String address;
    private String note;
} 