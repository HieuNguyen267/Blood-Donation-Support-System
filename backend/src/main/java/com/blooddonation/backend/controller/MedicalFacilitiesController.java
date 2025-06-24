package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.MedicalFacilitiesDTO;
import com.blooddonation.backend.service.MedicalFacilitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medical-facilities")
@CrossOrigin(origins = "*")
public class MedicalFacilitiesController {

    @Autowired
    private MedicalFacilitiesService medicalFacilitiesService;

    @GetMapping
    public ResponseEntity<List<MedicalFacilitiesDTO>> getAllMedicalFacilities() {
        List<MedicalFacilitiesDTO> facilities = medicalFacilitiesService.getAllMedicalFacilities();
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalFacilitiesDTO> getMedicalFacilityById(@PathVariable Integer id) {
        return medicalFacilitiesService.getMedicalFacilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/license/{licenseNumber}")
    public ResponseEntity<MedicalFacilitiesDTO> getMedicalFacilityByLicenseNumber(@PathVariable String licenseNumber) {
        return medicalFacilitiesService.getMedicalFacilityByLicenseNumber(licenseNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{facilityType}")
    public ResponseEntity<List<MedicalFacilitiesDTO>> getMedicalFacilitiesByType(@PathVariable String facilityType) {
        List<MedicalFacilitiesDTO> facilities = medicalFacilitiesService.getMedicalFacilitiesByType(facilityType);
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/search")
    public ResponseEntity<List<MedicalFacilitiesDTO>> searchMedicalFacilitiesByName(@RequestParam String name) {
        List<MedicalFacilitiesDTO> facilities = medicalFacilitiesService.searchMedicalFacilitiesByName(name);
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/check-license/{licenseNumber}")
    public ResponseEntity<Boolean> checkLicenseNumberExists(@PathVariable String licenseNumber) {
        boolean exists = medicalFacilitiesService.existsByLicenseNumber(licenseNumber);
        return ResponseEntity.ok(exists);
    }

    @PostMapping
    public ResponseEntity<MedicalFacilitiesDTO> createMedicalFacility(@RequestBody MedicalFacilitiesDTO facilityDTO) {
        try {
            MedicalFacilitiesDTO createdFacility = medicalFacilitiesService.createMedicalFacility(facilityDTO);
            return ResponseEntity.ok(createdFacility);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalFacilitiesDTO> updateMedicalFacility(@PathVariable Integer id, @RequestBody MedicalFacilitiesDTO facilityDTO) {
        try {
            MedicalFacilitiesDTO updatedFacility = medicalFacilitiesService.updateMedicalFacility(id, facilityDTO);
            if (updatedFacility != null) {
                return ResponseEntity.ok(updatedFacility);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalFacility(@PathVariable Integer id) {
        boolean deleted = medicalFacilitiesService.deleteMedicalFacility(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 