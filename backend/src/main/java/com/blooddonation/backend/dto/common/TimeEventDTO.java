package com.blooddonation.backend.dto.common;

import lombok.Data;
import java.time.LocalTime;

@Data
public class TimeEventDTO {
    private Integer timeEventId;
    private String timeRange;
    private LocalTime startTime;
    private LocalTime endTime;
    private String description;
} 