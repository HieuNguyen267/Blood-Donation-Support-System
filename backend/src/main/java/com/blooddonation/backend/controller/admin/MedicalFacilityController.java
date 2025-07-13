package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.MedicalFacilityDTO;
import com.blooddonation.backend.service.admin.MedicalFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/medical-facilities")
@CrossOrigin(origins = "*")
public class MedicalFacilityController {
    @Autowired
    private MedicalFacilityService medicalFacilityService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<MedicalFacilityDTO>> getAllFacilities() {
        return ResponseEntity.ok(medicalFacilityService.getAllFacilities());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<MedicalFacilityDTO> getFacilityById(@PathVariable Long id) {
        return medicalFacilityService.getFacilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<MedicalFacilityDTO> createFacility(@RequestBody MedicalFacilityDTO dto) {
        return ResponseEntity.ok(medicalFacilityService.createFacility(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> updateFacility(@PathVariable Long id, @RequestBody MedicalFacilityDTO dto) {
        try {
            MedicalFacilityDTO updated = medicalFacilityService.updateFacility(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("License number already exists")) {
                return ResponseEntity.badRequest().body("License number already exists");
            } else if (e.getMessage().contains("Medical facility not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Void> deleteFacility(@PathVariable Long id) {
        medicalFacilityService.deleteFacility(id);
        return ResponseEntity.ok().build();
    }
} 