package com.blooddonation.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Event")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "event_name", nullable = false, length = 200)
    private String eventName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "target_donors")
    private Integer targetDonors;

    @Column(name = "registered_donors")
    private Integer registeredDonors = 0;

    @Column(name = "actual_donors")
    private Integer actualDonors = 0;

    @Column(name = "target_blood_units")
    private Integer targetBloodUnits;

    @Column(name = "collected_blood_units")
    private Integer collectedBloodUnits = 0;

    @Column(length = 100)
    private String organizer;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(length = 20)
    private String status = "planned";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 