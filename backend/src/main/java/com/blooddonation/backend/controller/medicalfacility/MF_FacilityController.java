package com.blooddonation.backend.controller.medicalfacility;

import com.blooddonation.backend.entity.admin.MedicalFacility;
import com.blooddonation.backend.repository.admin.MedicalFacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medical-facility")
@CrossOrigin(origins = "*")
public class MF_FacilityController {
    @Autowired
    private MedicalFacilityRepository medicalFacilityRepository;

    @GetMapping("/by-account/{accountId}")
    public ResponseEntity<MedicalFacility> getFacilityByAccountId(@PathVariable Integer accountId) {
        MedicalFacility facility = medicalFacilityRepository.findByAccountId(accountId);
        if (facility != null) {
            return ResponseEntity.ok(facility);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 