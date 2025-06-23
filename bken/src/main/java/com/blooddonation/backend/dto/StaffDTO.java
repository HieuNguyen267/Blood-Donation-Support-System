package com.blooddonation.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class StaffDTO {
    private Integer staffId;
    private Integer accountId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String phone;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Integer getStaffId() { return staffId; }
    public void setStaffId(Integer staffId) { this.staffId = staffId; }

    public Integer getAccountId() { return accountId; }
    public void setAccountId(Integer accountId) { this.accountId = accountId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 