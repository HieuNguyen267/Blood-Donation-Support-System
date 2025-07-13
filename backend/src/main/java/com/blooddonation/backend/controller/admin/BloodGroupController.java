package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.entity.admin.BloodGroup;
import com.blooddonation.backend.repository.admin.BloodGroupRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blood-groups")
@CrossOrigin(origins = "*")
public class BloodGroupController {

    private final BloodGroupRepository bloodGroupRepository;

    public BloodGroupController(BloodGroupRepository bloodGroupRepository) {
        this.bloodGroupRepository = bloodGroupRepository;
    }

    @GetMapping
    public ResponseEntity<List<BloodGroup>> getAllBloodGroups() {
        List<BloodGroup> bloodGroups = bloodGroupRepository.findAll();
        return ResponseEntity.ok(bloodGroups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodGroup> getBloodGroupById(@PathVariable Integer id) {
        return bloodGroupRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BloodGroup> createBloodGroup(@RequestBody BloodGroup bloodGroup) {
        BloodGroup savedBloodGroup = bloodGroupRepository.save(bloodGroup);
        return ResponseEntity.ok(savedBloodGroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodGroup> updateBloodGroup(@PathVariable Integer id, @RequestBody BloodGroup bloodGroup) {
        if (bloodGroupRepository.existsById(id)) {
            bloodGroup.setBloodGroupId(id);
            BloodGroup savedBloodGroup = bloodGroupRepository.save(bloodGroup);
            return ResponseEntity.ok(savedBloodGroup);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloodGroup(@PathVariable Integer id) {
        if (bloodGroupRepository.existsById(id)) {
            bloodGroupRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/hello")
    public String hello() {
        return "BloodGroupController is working!";
    }
} 