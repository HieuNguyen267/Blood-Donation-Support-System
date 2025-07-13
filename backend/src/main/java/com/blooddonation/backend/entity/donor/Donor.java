package com.blooddonation.backend.entity.donor;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import com.blooddonation.backend.entity.admin.BloodGroup;
import com.blooddonation.backend.entity.common.Account;

@Entity
@Table(name = "Donor")
@Data
public class Donor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "donor_id")
    private Integer donorId;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 10)
    private String gender;

    @ManyToOne
    @JoinColumn(name = "blood_group_id", nullable = false)
    private BloodGroup bloodGroup;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    @Column(precision = 5, scale = 2)
    private BigDecimal height;

    @Column(name = "last_donation_date")
    private LocalDate lastDonationDate;

    @Column(name = "total_donations")
    private Integer totalDonations = 0;

    @Column(name = "is_eligible")
    private Boolean isEligible = true;

    @Column(name = "is_available_for_emergency")
    private Boolean isAvailableForEmergency = false;

    @Column(name = "available_from")
    private java.time.LocalDate availableFrom;

    @Column(name = "available_until")
    private java.time.LocalDate availableUntil;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "job", length = 100)
    private String job;

    @Column(name = "note")
    private String note;

    public Integer getDonorId() { return donorId; }
    public void setDonorId(Integer donorId) { this.donorId = donorId; }

    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public BloodGroup getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(BloodGroup bloodGroup) { this.bloodGroup = bloodGroup; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public BigDecimal getWeight() { return weight; }
    public void setWeight(BigDecimal weight) { this.weight = weight; }

    public BigDecimal getHeight() { return height; }
    public void setHeight(BigDecimal height) { this.height = height; }

    public LocalDate getLastDonationDate() { return lastDonationDate; }
    public void setLastDonationDate(LocalDate lastDonationDate) { this.lastDonationDate = lastDonationDate; }

    public Integer getTotalDonations() { return totalDonations; }
    public void setTotalDonations(Integer totalDonations) { this.totalDonations = totalDonations; }

    public Boolean getIsEligible() { return isEligible; }
    public void setIsEligible(Boolean isEligible) { this.isEligible = isEligible; }

    public Boolean getIsAvailableForEmergency() { return isAvailableForEmergency; }
    public void setIsAvailableForEmergency(Boolean isAvailableForEmergency) { this.isAvailableForEmergency = isAvailableForEmergency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getJob() { return job; }
    public void setJob(String job) { this.job = job; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public java.time.LocalDate getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(java.time.LocalDate availableFrom) { this.availableFrom = availableFrom; }
    public java.time.LocalDate getAvailableUntil() { return availableUntil; }
    public void setAvailableUntil(java.time.LocalDate availableUntil) { this.availableUntil = availableUntil; }
} 