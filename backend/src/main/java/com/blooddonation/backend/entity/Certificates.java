package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Certificates")
@Data
public class Certificates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id")
    private Integer certificateId;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @ManyToOne
    @JoinColumn(name = "register_id")
    private DonationRegister donationRegister;

    @ManyToOne
    @JoinColumn(name = "matching_id")
    private MatchingBlood matchingBlood;

    @Column(name = "certificate_number", nullable = false, unique = true, length = 50)
    private String certificateNumber;

    @Column(name = "donation_date", nullable = false)
    private LocalDate donationDate;

    @Column(name = "blood_volume")
    private Integer bloodVolume;

    @Column(name = "donation_location", length = 200)
    private String donationLocation;

    @Column(name = "milestone_type", length = 50)
    private String milestoneType;

    @Column(name = "issued_date", nullable = false)
    private LocalDate issuedDate;

    @Column(name = "issued_by", nullable = false, length = 100)
    private String issuedBy;

    @ManyToOne
    @JoinColumn(name = "issued_by_staff_id", nullable = false)
    private Staff issuedByStaff;

    @Column(name = "digital_signature", columnDefinition = "TEXT")
    private String digitalSignature;

    @Column(name = "qr_code", columnDefinition = "TEXT")
    private String qrCode;

    @Column(name = "verification_code", unique = true, length = 20)
    private String verificationCode;

    @Column(name = "is_verified")
    private Boolean isVerified = true;

    @Column(name = "certificate_status", length = 20)
    private String certificateStatus = "active";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 