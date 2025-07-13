package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.StaffDTO;
import com.blooddonation.backend.service.admin.StaffService;
import com.blooddonation.backend.entity.admin.Staff;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin-staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @GetMapping
    public ResponseEntity<List<StaffDTO>> getAllStaff() {
        List<StaffDTO> staff = staffService.getAllStaff();
        return ResponseEntity.ok(staff);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffDTO> getStaffById(@PathVariable Integer id) {
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<List<StaffDTO>> getStaffByAccountId(@PathVariable Integer accountId) {
        System.out.println("Getting staff by accountId: " + accountId);
        List<StaffDTO> staff = staffService.getStaffByAccountId(accountId);
        System.out.println("Found staff count: " + staff.size());
        if (!staff.isEmpty()) {
            System.out.println("First staff: " + staff.get(0).getFullName());
            System.out.println("First staff ID: " + staff.get(0).getStaffId());
        } else {
            System.out.println("No staff found for accountId: " + accountId);
        }
        return ResponseEntity.ok(staff);
    }

    @PostMapping
    public ResponseEntity<StaffDTO> createStaff(@RequestBody StaffDTO staffDTO) {
        try {
            StaffDTO createdStaff = staffService.createStaff(staffDTO);
            return ResponseEntity.ok(createdStaff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/create-default/{accountId}")
    public ResponseEntity<StaffDTO> createDefaultStaff(@PathVariable Integer accountId) {
        try {
            // Create default staff for account
            StaffDTO defaultStaff = new StaffDTO();
            defaultStaff.setAccountId(accountId);
            defaultStaff.setFullName("Admin User");
            defaultStaff.setEmail("admin@system.com");
            defaultStaff.setGender("other");
            defaultStaff.setAddress("System Address");
            defaultStaff.setPhone("0000000000");
            defaultStaff.setDateOfBirth(java.time.LocalDate.of(1990, 1, 1));
            
            StaffDTO createdStaff = staffService.createStaff(defaultStaff);
            System.out.println("Created default staff for accountId: " + accountId);
            return ResponseEntity.ok(createdStaff);
        } catch (Exception e) {
            System.out.println("Error creating default staff: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffDTO> updateStaff(@PathVariable Integer id, @RequestBody StaffDTO staffDTO) {
        StaffDTO updatedStaff = staffService.updateStaff(id, staffDTO);
        if (updatedStaff != null) {
            return ResponseEntity.ok(updatedStaff);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Integer id) {
        boolean deleted = staffService.deleteStaff(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 