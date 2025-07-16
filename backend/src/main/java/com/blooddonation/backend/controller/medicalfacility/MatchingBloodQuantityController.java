package com.blooddonation.backend.controller.medicalfacility;

import com.blooddonation.backend.service.medicalfacility.MatchingBloodFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-facility/matching-blood")
public class MatchingBloodQuantityController {
    @Autowired
    private MatchingBloodFacilityService matchingBloodFacilityService;

    @PutMapping("/{matchingId}/quantity")
    public ResponseEntity<Void> updateMatchingBloodQuantity(@PathVariable Integer matchingId, @RequestBody Map<String, Integer> body) {
        Integer quantityMl = body.get("quantityMl");
        matchingBloodFacilityService.updateQuantityMl(matchingId, quantityMl);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{matchingId}/confirm-completed")
    public ResponseEntity<Void> confirmCompleted(@PathVariable Integer matchingId) {
        matchingBloodFacilityService.confirmCompleted(matchingId);
        return ResponseEntity.ok().build();
    }
} 