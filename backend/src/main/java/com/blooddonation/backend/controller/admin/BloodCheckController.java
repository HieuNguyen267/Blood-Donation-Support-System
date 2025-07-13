package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.BloodCheckDTO;
import com.blooddonation.backend.service.admin.BloodCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/blood-checks")
@CrossOrigin(origins = "*")
public class BloodCheckController {

    @Autowired
    private BloodCheckService bloodCheckService;

    @GetMapping
    public ResponseEntity<List<BloodCheckDTO>> getAllBloodChecks() {
        List<BloodCheckDTO> bloodChecks = bloodCheckService.getAllBloodChecks();
        return ResponseEntity.ok(bloodChecks);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BloodCheckDTO>> getBloodChecksByStatus(@PathVariable String status) {
        List<BloodCheckDTO> bloodChecks = bloodCheckService.getBloodChecksByStatus(status);
        return ResponseEntity.ok(bloodChecks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodCheckDTO> getBloodCheckById(@PathVariable Integer id) {
        BloodCheckDTO bloodCheck = bloodCheckService.getBloodCheckById(id);
        return ResponseEntity.ok(bloodCheck);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BloodCheckDTO> updateBloodCheckStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        BloodCheckDTO updatedBloodCheck = bloodCheckService.updateBloodCheckStatus(id, newStatus);
        return ResponseEntity.ok(updatedBloodCheck);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodCheckDTO> updateBloodCheck(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> request) {
        BloodCheckDTO updatedBloodCheck = bloodCheckService.updateBloodCheck(id, request);
        return ResponseEntity.ok(updatedBloodCheck);
    }
} 