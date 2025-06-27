package com.blooddonation.backend.dto.admin;

public class BloodGroupDTO {
    private Integer bloodGroupId;
    private String aboType;
    private String rhFactor;

    public Integer getBloodGroupId() {
        return bloodGroupId;
    }
    public void setBloodGroupId(Integer bloodGroupId) {
        this.bloodGroupId = bloodGroupId;
    }

    public String getAboType() {
        return aboType;
    }
    public void setAboType(String aboType) {
        this.aboType = aboType;
    }

    public String getRhFactor() {
        return rhFactor;
    }
    public void setRhFactor(String rhFactor) {
        this.rhFactor = rhFactor;
    }
} 