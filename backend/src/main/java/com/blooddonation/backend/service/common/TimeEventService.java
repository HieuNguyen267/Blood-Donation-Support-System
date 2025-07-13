package com.blooddonation.backend.service.common;

import com.blooddonation.backend.dto.common.TimeEventDTO;
import java.util.List;
import java.util.Optional;
 
public interface TimeEventService {
    List<TimeEventDTO> getAllTimeEvents();
    Optional<TimeEventDTO> getTimeEventById(Integer id);
} 