package com.blooddonation.backend.controller.medicalfacility;

import com.blooddonation.backend.dto.medicalfacility.MF_BloodRequestDTO;
import com.blooddonation.backend.service.medicalfacility.MF_BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical-facility/blood-requests")
public class MF_BloodRequestController {
    @Autowired
    private MF_BloodRequestService bloodRequestService;

    @PostMapping
    public ResponseEntity<MF_BloodRequestDTO> createBloodRequest(@RequestBody MF_BloodRequestDTO dto) {
        MF_BloodRequestDTO created = bloodRequestService.createBloodRequest(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<MF_BloodRequestDTO>> getAllBloodRequests() {
        List<MF_BloodRequestDTO> list = bloodRequestService.getAllBloodRequests();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MF_BloodRequestDTO> getBloodRequestById(@PathVariable Integer id) {
        MF_BloodRequestDTO dto = bloodRequestService.getBloodRequestById(id);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloodRequest(@PathVariable Integer id) {
        boolean deleted = bloodRequestService.deleteBloodRequest(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
} 