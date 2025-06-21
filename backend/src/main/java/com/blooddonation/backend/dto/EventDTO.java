package com.blooddonation.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventDTO {
    private Integer eventId;
    private String eventName;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer targetDonors;
    private Integer registeredDonors;
    private Integer actualDonors;
    private Integer targetBloodUnits;
    private Integer collectedBloodUnits;
    private String organizer;
    private String contactPhone;
    private String status;
} 