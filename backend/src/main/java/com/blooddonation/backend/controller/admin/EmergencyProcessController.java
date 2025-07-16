package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.MatchingBloodAdminDTO;
import com.blooddonation.backend.service.admin.EmergencyProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/emergency-process")
public class EmergencyProcessController {

    @Autowired
    private EmergencyProcessService emergencyProcessService;

    @GetMapping("/blood-requests/{requestId}/accepted-donors")
    public ResponseEntity<List<MatchingBloodAdminDTO>> getAcceptedDonors(@PathVariable Integer requestId) {
        List<MatchingBloodAdminDTO> list = emergencyProcessService.getAcceptedDonorsByRequestId(requestId);
        return ResponseEntity.ok(list);
    }
} 