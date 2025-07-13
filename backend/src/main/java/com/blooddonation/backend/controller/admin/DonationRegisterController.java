package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.DonationRegisterDTO;
import com.blooddonation.backend.dto.admin.DonationManagementDTO;
import com.blooddonation.backend.service.admin.DonationRegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/donation-registers")
@CrossOrigin(origins = "*")
public class DonationRegisterController {

    @Autowired
    private DonationRegisterService donationRegisterService;

    // ============= DONATION MANAGEMENT ENDPOINTS =============
    // Endpoints cho trang quản lý đơn hiến

    /**
     * Lấy tất cả đơn hiến cho trang quản lý
     * GET /donation-registers/management
     */
    @GetMapping("/management")
    public ResponseEntity<List<DonationManagementDTO>> getAllForManagement() {
        return ResponseEntity.ok(donationRegisterService.getAllForManagement());
    }

    /**
     * Lấy đơn hiến theo status cho trang quản lý
     * GET /donation-registers/management/status/{status}
     */
    @GetMapping("/management/status/{status}")
    public ResponseEntity<List<DonationManagementDTO>> getByStatusForManagement(@PathVariable String status) {
        return ResponseEntity.ok(donationRegisterService.getByStatusForManagement(status));
    }

    /**
     * Lấy đơn hiến theo nhóm máu cho trang quản lý
     * GET /donation-registers/management/blood-group/{bloodGroup}
     */
    @GetMapping("/management/blood-group/{bloodGroup}")
    public ResponseEntity<List<DonationManagementDTO>> getByBloodGroupForManagement(@PathVariable String bloodGroup) {
        return ResponseEntity.ok(donationRegisterService.getByBloodGroupForManagement(bloodGroup));
    }

    /**
     * Search đơn hiến theo tên cho trang quản lý
     * GET /donation-registers/management/search?q={searchTerm}
     */
    @GetMapping("/management/search")
    public ResponseEntity<List<DonationManagementDTO>> searchByDonorNameForManagement(@RequestParam("q") String searchTerm) {
        return ResponseEntity.ok(donationRegisterService.searchByDonorNameForManagement(searchTerm));
    }

    /**
     * Cập nhật status của đơn hiến (approve/reject)
     * PUT /donation-registers/{id}/status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<DonationManagementDTO> updateDonationStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        return ResponseEntity.ok(donationRegisterService.updateDonationStatus(id, newStatus));
    }

    /**
     * Cập nhật kết quả kiểm tra sức khỏe
     * PUT /donation-registers/{id}/health-check
     */
    @PutMapping("/{id}/health-check")
    public ResponseEntity<DonationRegisterDTO> updateHealthCheckResult(
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {
        String healthCheckResult = request.get("healthCheckResult");
        return ResponseEntity.ok(donationRegisterService.updateHealthCheckResult(id, healthCheckResult));
    }

    /**
     * Cập nhật số lượng máu hiến
     * PUT /donation-registers/{id}/quantity
     */
    @PutMapping("/{id}/quantity")
    public ResponseEntity<DonationRegisterDTO> updateBloodQuantity(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> request) {
        Integer quantity = (Integer) request.get("quantity");
        return ResponseEntity.ok(donationRegisterService.updateBloodQuantity(id, quantity));
    }

    /**
     * Cập nhật donation status (processing, deferred, completed)
     * PUT /donation-registers/{id}/donation-status
     */
    @PutMapping("/{id}/donation-status")
    public ResponseEntity<DonationRegisterDTO> updateDonationProcessStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> request) {
        System.out.println("DEBUG: Received request body: " + request);
        System.out.println("DEBUG: Request body keys: " + request.keySet());
        
        String donationStatus = (String) request.get("donationStatus");
        String incidentDescription = (String) request.get("incidentDescription");
        Object staffIdObj = request.get("staffId");
        Integer staffId = null;
        
        System.out.println("DEBUG: staffIdObj from request: " + staffIdObj);
        System.out.println("DEBUG: staffIdObj type: " + (staffIdObj != null ? staffIdObj.getClass().getName() : "null"));
        
        if (staffIdObj != null) {
            try {
                if (staffIdObj instanceof Integer) {
                    staffId = (Integer) staffIdObj;
                } else if (staffIdObj instanceof String) {
                    staffId = Integer.parseInt((String) staffIdObj);
                } else if (staffIdObj instanceof Number) {
                    staffId = ((Number) staffIdObj).intValue();
                } else if (staffIdObj instanceof Double) {
                    staffId = ((Double) staffIdObj).intValue();
                } else if (staffIdObj instanceof Long) {
                    staffId = ((Long) staffIdObj).intValue();
                }
                System.out.println("DEBUG: Successfully parsed staffId: " + staffId);
            } catch (Exception e) {
                System.out.println("DEBUG: Error parsing staffId: " + e.getMessage());
                staffId = null;
            }
        }
        
        // Validate staffId is required
        if (staffId == null) {
            System.out.println("DEBUG: staffId is null - cannot proceed");
            throw new IllegalArgumentException("Staff ID is required");
        }
        
        System.out.println("DEBUG: Final values - donationStatus: " + donationStatus + ", staffId: " + staffId);
        return ResponseEntity.ok(donationRegisterService.updateDonationProcessStatus(id, donationStatus, incidentDescription, staffId));
    }

    // ============= EXISTING ENDPOINTS =============
    // Endpoints hiện tại

    @PostMapping
    public ResponseEntity<DonationRegisterDTO> createDonationRegister(@RequestBody DonationRegisterDTO dto) {
        return ResponseEntity.ok(donationRegisterService.createDonationRegister(dto));
    }

    @PostMapping("/registerdonate")
    public ResponseEntity<DonationRegisterDTO> createAppointment(@RequestBody DonationRegisterDTO dto) {
        DonationRegisterDTO created = donationRegisterService.createDonationRegister(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DonationRegisterDTO> updateDonationRegister(
            @PathVariable Integer id,
            @RequestBody DonationRegisterDTO dto) {
        return ResponseEntity.ok(donationRegisterService.updateDonationRegister(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonationRegister(@PathVariable Integer id) {
        donationRegisterService.deleteDonationRegister(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationRegisterDTO> getDonationRegister(@PathVariable Integer id) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegister(id));
    }

    @GetMapping
    public ResponseEntity<List<DonationRegisterDTO>> getAllDonationRegisters() {
        return ResponseEntity.ok(donationRegisterService.getAllDonationRegisters());
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationRegisterDTO>> getDonationRegistersByDonor(@PathVariable Integer donorId) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegistersByDonor(donorId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<DonationRegisterDTO>> getDonationRegistersByEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegistersByEvent(eventId));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<DonationRegisterDTO>> getDonationRegistersByStaff(@PathVariable Integer staffId) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegistersByStaff(staffId));
    }

    @GetMapping("/full-info/{id}")
    public ResponseEntity<DonationRegisterDTO> getDonationRegisterFullInfo(@PathVariable Integer id) {
        return ResponseEntity.ok(donationRegisterService.getDonationRegisterFullInfo(id));
    }
} 