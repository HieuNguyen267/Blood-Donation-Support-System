package com.blooddonation.backend.dto.donor;
import java.math.BigDecimal;

public class DonorDTO {
    private Integer donorId;
    private String fullName;
    private String dateOfBirth;
    private String gender;
    private String address;
    private String bloodGroup;
    private String aboType;
    private String rhFactor;
    private String job;
    private String phone;
    private String email;
    private BigDecimal weight;
    private String lastDonationDate;
    private Boolean isEligible;
    private String availableFrom;
    private String availableUntil;

    public Integer getDonorId() {
        return donorId;
    }
    public void setDonorId(Integer donorId) {
        this.donorId = donorId;
    }
    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    public String getDateOfBirth() {
        return dateOfBirth;
    }
    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getBloodGroup() {
        return bloodGroup;
    }
    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
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
    public String getJob() {
        return job;
    }
    public void setJob(String job) {
        this.job = job;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public BigDecimal getWeight() {
        return weight;
    }
    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }
    public String getLastDonationDate() {
        return lastDonationDate;
    }
    public void setLastDonationDate(String lastDonationDate) {
        this.lastDonationDate = lastDonationDate;
    }
    public Boolean getIsEligible() {
        return isEligible;
    }
    public void setIsEligible(Boolean isEligible) {
        this.isEligible = isEligible;
    }
    public String getAvailableFrom() {
        return availableFrom;
    }
    public void setAvailableFrom(String availableFrom) {
        this.availableFrom = availableFrom;
    }
    public String getAvailableUntil() {
        return availableUntil;
    }
    public void setAvailableUntil(String availableUntil) {
        this.availableUntil = availableUntil;
    }
} 