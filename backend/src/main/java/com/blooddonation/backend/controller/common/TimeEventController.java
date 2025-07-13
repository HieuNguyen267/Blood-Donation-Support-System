package com.blooddonation.backend.controller.common;

import com.blooddonation.backend.dto.common.TimeEventDTO;
import com.blooddonation.backend.service.common.TimeEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/time-events")
@CrossOrigin(origins = "*")
public class TimeEventController {

    @Autowired
    private TimeEventService timeEventService;

    @GetMapping
    public ResponseEntity<List<TimeEventDTO>> getAllTimeEvents() {
        List<TimeEventDTO> timeEvents = timeEventService.getAllTimeEvents();
        return ResponseEntity.ok(timeEvents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeEventDTO> getTimeEventById(@PathVariable Integer id) {
        return timeEventService.getTimeEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 