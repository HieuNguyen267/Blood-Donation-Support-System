package com.blooddonation.backend.entity.common;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_request")
@Data
public class EmergencyRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String requesterName;
    private String bloodGroup;
    private Integer quantity;
    private String phone;
    private String address;
    private String note;
    private LocalDateTime createdAt;
} 