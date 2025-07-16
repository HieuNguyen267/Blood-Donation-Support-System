package com.blooddonation.backend.controller.medicalfacility;

import com.blooddonation.backend.dto.medicalfacility.MatchingBloodFacilityDTO;
import com.blooddonation.backend.service.medicalfacility.MatchingBloodFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical-facility/blood-requests/{requestId}/emergency-process")
public class MatchingBloodFacilityController {
    @Autowired
    private MatchingBloodFacilityService matchingBloodFacilityService;

    @GetMapping
    public ResponseEntity<List<MatchingBloodFacilityDTO>> getEmergencyProcess(@PathVariable Integer requestId) {
        List<MatchingBloodFacilityDTO> list = matchingBloodFacilityService.getMatchingByRequestId(requestId);
        return ResponseEntity.ok(list);
    }
} 