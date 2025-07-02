package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.BloodRequestDTO;
import com.blooddonation.backend.service.admin.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blood-requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    @Autowired
    private BloodRequestService bloodRequestService;

    @GetMapping
    public ResponseEntity<List<BloodRequestDTO>> getAllBloodRequests() {
        List<BloodRequestDTO> requests = bloodRequestService.getAllBloodRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodRequestDTO> getBloodRequestById(@PathVariable Integer id) {
        return bloodRequestService.getBloodRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/facility/{facilityId}")
    public ResponseEntity<List<BloodRequestDTO>> getBloodRequestsByFacility(@PathVariable Integer facilityId) {
        List<BloodRequestDTO> requests = bloodRequestService.getBloodRequestsByFacility(facilityId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BloodRequestDTO>> getBloodRequestsByStatus(@PathVariable String status) {
        List<BloodRequestDTO> requests = bloodRequestService.getBloodRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/urgent")
    public ResponseEntity<List<BloodRequestDTO>> getUrgentRequests() {
        List<BloodRequestDTO> requests = bloodRequestService.getUrgentRequests();
        return ResponseEntity.ok(requests);
    }

    @PostMapping
    public ResponseEntity<BloodRequestDTO> createBloodRequest(@RequestBody BloodRequestDTO requestDTO) {
        try {
            BloodRequestDTO createdRequest = bloodRequestService.createBloodRequest(requestDTO);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/emergency")
    public ResponseEntity<BloodRequestDTO> createEmergencyBloodRequest(@RequestBody BloodRequestDTO requestDTO) {
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

    @PutMapping("/{id}")
    public ResponseEntity<BloodRequestDTO> updateBloodRequest(@PathVariable Integer id, @RequestBody BloodRequestDTO requestDTO) {
        BloodRequestDTO updatedRequest = bloodRequestService.updateBloodRequest(id, requestDTO);
        if (updatedRequest != null) {
            return ResponseEntity.ok(updatedRequest);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BloodRequestDTO> updateRequestStatus(@PathVariable Integer id, @RequestParam String status) {
        BloodRequestDTO updatedRequest = bloodRequestService.updateRequestStatus(id, status);
        if (updatedRequest != null) {
            return ResponseEntity.ok(updatedRequest);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloodRequest(@PathVariable Integer id) {
        boolean deleted = bloodRequestService.deleteBloodRequest(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 