package com.blooddonation.backend.controller.common;

import com.blooddonation.backend.dto.admin.BloodRequestDTO;
import com.blooddonation.backend.service.admin.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @PostMapping
    public ResponseEntity<BloodRequestDTO> createEmergencyRequest(@RequestBody BloodRequestDTO requestDTO) {
        try {
            requestDTO.setUrgencyLevel("emergency");
            if (requestDTO.getRequestStatus() == null) {
                requestDTO.setRequestStatus("pending");
            }
            BloodRequestDTO createdRequest = bloodRequestService.createBloodRequest(requestDTO);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 