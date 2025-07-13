package com.blooddonation.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodStockDTO {
    
    private Long stockId;
    private Long bloodGroupId;
    private String bloodGroupName;
    private String aboType;
    private String rhFactor;
    private Integer volume;
    private String temperatureRange;
} 