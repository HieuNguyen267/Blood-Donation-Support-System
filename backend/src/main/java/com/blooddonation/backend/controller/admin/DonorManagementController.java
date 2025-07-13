package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.DonorManagementDTO;
import com.blooddonation.backend.service.admin.DonorManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/donors")
@CrossOrigin(origins = "*")
public class DonorManagementController {
    
    @Autowired
    private DonorManagementService donorManagementService;
    
    @GetMapping
    public ResponseEntity<List<DonorManagementDTO>> getAllDonors() {
        List<DonorManagementDTO> donors = donorManagementService.getAllDonors();
        return ResponseEntity.ok(donors);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DonorManagementDTO> getDonorById(@PathVariable Integer id) {
        Optional<DonorManagementDTO> donor = donorManagementService.getDonorById(id);
        return donor.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}/eligibility")
    public ResponseEntity<?> updateDonorEligibility(@PathVariable Integer id, @RequestParam Boolean isEligible) {
        try {
            DonorManagementDTO updatedDonor = donorManagementService.updateDonorEligibility(id, isEligible);
            return ResponseEntity.ok(updatedDonor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/eligibility/{isEligible}")
    public ResponseEntity<List<DonorManagementDTO>> getDonorsByEligibility(@PathVariable Boolean isEligible) {
        List<DonorManagementDTO> donors = donorManagementService.getDonorsByEligibility(isEligible);
        return ResponseEntity.ok(donors);
    }
    
    @GetMapping("/blood-group/{bloodGroupId}")
    public ResponseEntity<List<DonorManagementDTO>> getDonorsByBloodGroup(@PathVariable Integer bloodGroupId) {
        List<DonorManagementDTO> donors = donorManagementService.getDonorsByBloodGroup(bloodGroupId);
        return ResponseEntity.ok(donors);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(@PathVariable Integer id) {
        try {
            donorManagementService.deleteDonor(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 