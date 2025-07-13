package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.DonationManagementDTO;
import com.blooddonation.backend.service.admin.DonationRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donation-process")
@CrossOrigin(origins = "*")
public class DonationProcessController {

    @Autowired
    private DonationRegisterService donationRegisterService;

    /**
     * Lấy tất cả quá trình hiến máu cho trang quản lý
     * GET /donation-process/management
     */
    @GetMapping("/management")
    public ResponseEntity<List<DonationManagementDTO>> getAllForProcessManagement() {
        return ResponseEntity.ok(donationRegisterService.getAllForProcessManagement());
    }

    /**
     * Lấy quá trình hiến máu theo status cho trang quản lý
     * GET /donation-process/management/status/{status}
     */
    @GetMapping("/management/status/{status}")
    public ResponseEntity<List<DonationManagementDTO>> getByStatusForProcessManagement(@PathVariable String status) {
        return ResponseEntity.ok(donationRegisterService.getByStatusForProcessManagement(status));
    }

    /**
     * Lấy quá trình hiến máu theo nhóm máu cho trang quản lý
     * GET /donation-process/management/blood-group/{bloodGroup}
     */
    @GetMapping("/management/blood-group/{bloodGroup}")
    public ResponseEntity<List<DonationManagementDTO>> getByBloodGroupForProcessManagement(@PathVariable String bloodGroup) {
        return ResponseEntity.ok(donationRegisterService.getByBloodGroupForProcessManagement(bloodGroup));
    }

    /**
     * Search quá trình hiến máu theo tên cho trang quản lý
     * GET /donation-process/management/search?q={searchTerm}
     */
    @GetMapping("/management/search")
    public ResponseEntity<List<DonationManagementDTO>> searchByDonorNameForProcessManagement(@RequestParam("q") String searchTerm) {
        return ResponseEntity.ok(donationRegisterService.searchByDonorNameForProcessManagement(searchTerm));
    }
} 