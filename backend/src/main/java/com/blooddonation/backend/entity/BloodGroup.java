package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "Blood_Group")
@Data
public class BloodGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "blood_group_id")
    private Integer bloodGroupId;

    @Column(name = "abo_type", nullable = false, length = 5)
    private String aboType;

    @Column(name = "rh_factor", nullable = false, length = 10)
    private String rhFactor;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 