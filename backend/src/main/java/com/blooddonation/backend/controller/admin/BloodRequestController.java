package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.BloodRequestDTO;
import com.blooddonation.backend.service.admin.BloodRequestService;
import com.blooddonation.backend.service.common.EmailService;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import com.blooddonation.backend.repository.admin.BloodRequestRepository;
import com.blooddonation.backend.entity.admin.BloodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/admin/blood-requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {
    private static final Logger logger = LoggerFactory.getLogger(BloodRequestController.class);

    @Autowired
    private BloodRequestService bloodRequestService;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private MatchingBloodRepository matchingBloodRepository;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @GetMapping("/test")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("BloodRequestController is working!");
    }

    @GetMapping("/count")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Map<String, Object>> getCount() {
        List<BloodRequestDTO> allRequests = bloodRequestService.getAllRequests();
        Map<String, Object> response = new HashMap<>();
        response.put("count", allRequests.size());
        response.put("requests", allRequests);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-test-data")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<String> createTestData() {
        try {
            // Tạo dữ liệu test
            bloodRequestService.createTestData();
            return ResponseEntity.ok("Test data created successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating test data: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<BloodRequestDTO>> getAllRequests() {
        return ResponseEntity.ok(bloodRequestService.getAllRequests());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BloodRequestDTO> getRequestById(@PathVariable Integer id) {
        BloodRequestDTO request = bloodRequestService.getRequestById(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BloodRequestDTO> updateRequestStatus(@PathVariable Integer id, @RequestBody StatusUpdateRequest request) {
        BloodRequestDTO updated = bloodRequestService.updateRequestStatus(id, request.getStatus());
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/send-blood")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BloodRequestDTO> sendBlood(@PathVariable Integer id, @RequestBody SendBloodRequest request) {
        BloodRequestDTO updated = bloodRequestService.sendBlood(id, request.getSentBlood(), request.getDeliveryPerson());
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/processing-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BloodRequestDTO> updateProcessingStatus(@PathVariable Integer id, @RequestBody ProcessingStatusRequest request) {
        BloodRequestDTO updated = bloodRequestService.updateProcessingStatus(id, request.getProcessingStatus());
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/emergency-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<BloodRequestDTO> updateEmergencyStatus(@PathVariable Integer id, @RequestBody EmergencyStatusRequest request) {
        BloodRequestDTO updated = bloodRequestService.updateEmergencyStatus(id, request.getEmergencyStatus());
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{requestId}/complete-emergency")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> completeEmergencyRequest(@PathVariable Integer requestId) {
        // Cập nhật tất cả matching_blood liên quan (trừ những cái có status 'rejected')
        List<MatchingBlood> matchings = matchingBloodRepository.findByRequestId(requestId);
        for (MatchingBlood m : matchings) {
            // Chỉ cập nhật nếu status không phải 'rejected'
            if (!"rejected".equals(m.getStatus())) {
                m.setStatus("completed");
            }
        }
        matchingBloodRepository.saveAll(matchings);
        // Cập nhật blood_request
        BloodRequest req = bloodRequestRepository.findById(requestId).orElse(null);
        if (req != null) {
            req.setProcessingStatus("completed");
            req.setEmergencyStatus("completed");
            bloodRequestRepository.save(req);
        }
        return ResponseEntity.ok(Map.of("message", "Đã hoàn thành quá trình yêu cầu máu khẩn cấp"));
    }

    @PostMapping("/{requestId}/contact-donor")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> contactDonorForEmergency(@PathVariable Integer requestId, @RequestBody ContactDonorRequest request) {
        try {
            // Lấy thông tin người hiến máu
            Donor donor = donorRepository.findById(request.getDonorId()).orElse(null);
            if (donor == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy người hiến máu"));
            }
            // Lấy thông tin yêu cầu máu (DTO và entity)
            BloodRequestDTO bloodRequest = bloodRequestService.getRequestById(requestId);
            BloodRequest bloodRequestEntity = bloodRequestRepository.findById(requestId).orElse(null);
            if (bloodRequest == null || bloodRequestEntity == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy yêu cầu máu"));
            }
            // Cập nhật emergency_status thành 'contacting' nếu chưa phải
            if (!"contacting".equals(bloodRequestEntity.getEmergencyStatus())) {
                bloodRequestEntity.setEmergencyStatus("contacting");
                bloodRequestRepository.save(bloodRequestEntity);
            }
            // Lấy email từ account của donor
            String donorEmail = donor.getAccount() != null ? donor.getAccount().getEmail() : donor.getEmail();
            if (donorEmail == null || donorEmail.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy email của người hiến máu"));
            }
            // Tạo URL chi tiết yêu cầu máu khẩn cấp
            String detailUrl = "http://localhost:3000/donor/emergency-request-detail/" + requestId;
            // Gửi email
            emailService.sendEmergencyBloodRequestEmail(
                donorEmail,
                donor.getFullName(),
                detailUrl,
                bloodRequest.getFacilityName(),
                bloodRequest.getBloodGroup(),
                bloodRequest.getQuantityRequested().toString(),
                bloodRequest.getRequiredBy()
            );
            // Chỉ tạo mới nếu chưa có matching cho donor với request này
            boolean exists = matchingBloodRepository.findByRequestId(requestId).stream()
                .anyMatch(mb -> mb.getDonorId().equals(request.getDonorId()));
            if (!exists) {
                MatchingBlood matching = new MatchingBlood();
                matching.setRequestId(requestId);
                matching.setDonorId(request.getDonorId());
                matching.setFacilityId(bloodRequestEntity.getFacility().getFacilityId() != null ? bloodRequestEntity.getFacility().getFacilityId().intValue() : null);
                matching.setNotificationSentAt(java.time.LocalDateTime.now());
                matching.setStatus("contacting");
                if (request.getDistanceKm() != null) {
                    matching.setDistanceKm(java.math.BigDecimal.valueOf(request.getDistanceKm()));
                }
                matchingBloodRepository.save(matching);
            }
            return ResponseEntity.ok(Map.of("message", "Đã gửi email yêu cầu hiến máu khẩn cấp thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Lỗi khi gửi email: " + e.getMessage()));
        }
    }

    @PostMapping("/test-email")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> testEmail(@RequestBody Map<String, String> body) {
        try {
            String testEmail = body.get("email");
            if (testEmail == null) {
                testEmail = "swp391.donateblood@gmail.com"; // Default test email
            }
            
            emailService.sendEmergencyBloodRequestEmail(
                testEmail,
                "Test User",
                "http://localhost:3000/donor/emergency-request-detail/1",
                "BV Test",
                "A+",
                "500",
                "2024-07-15 10:00"
            );
            
            return ResponseEntity.ok(Map.of("message", "Test email sent successfully to: " + testEmail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Test email failed: " + e.getMessage()));
        }
    }

    @PostMapping("/test-simple-email")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> testSimpleEmail(@RequestBody Map<String, String> body) {
        try {
            String testEmail = body.get("email");
            if (testEmail == null) {
                testEmail = "swp391.donateblood@gmail.com"; // Default test email
            }
            
            // Gửi email đơn giản để test
            emailService.sendContactEmail(
                testEmail,
                "Test Email - Hệ thống Hiến máu",
                "Đây là email test để kiểm tra chức năng gửi email thật.\n\n" +
                "Nếu bạn nhận được email này, có nghĩa là chức năng gửi email đã hoạt động bình thường.\n\n" +
                "Thời gian test: " + java.time.LocalDateTime.now() + "\n\n" +
                "Hệ thống Hỗ trợ Hiến máu",
                "swp391.donateblood@gmail.com"
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Test email sent successfully to: " + testEmail,
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Test email failed: " + e.getMessage(),
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        }
    }

    @PostMapping("/test-email-no-auth")
    public ResponseEntity<?> testEmailNoAuth(@RequestBody Map<String, String> body) {
        try {
            String testEmail = body.get("email");
            if (testEmail == null) {
                testEmail = "swp391.donateblood@gmail.com"; // Default test email
            }
            
            // Log email details instead of sending
            logger.info("=== EMAIL TEST LOG ===");
            logger.info("To: {}", testEmail);
            logger.info("Subject: Test Email - Hệ thống Hiến máu");
            logger.info("Content: Đây là email test để kiểm tra chức năng gửi email thật.");
            logger.info("Time: {}", java.time.LocalDateTime.now());
            logger.info("=== END EMAIL TEST LOG ===");
            
            // Try to send email but catch any authentication errors
            try {
                emailService.sendContactEmail(
                    testEmail,
                    "Test Email - Hệ thống Hiến máu",
                    "Đây là email test để kiểm tra chức năng gửi email thật.\n\n" +
                    "Nếu bạn nhận được email này, có nghĩa là chức năng gửi email đã hoạt động bình thường.\n\n" +
                    "Thời gian test: " + java.time.LocalDateTime.now() + "\n\n" +
                    "Hệ thống Hỗ trợ Hiến máu",
                    "swp391.donateblood@gmail.com"
                );
                
                return ResponseEntity.ok(Map.of(
                    "message", "Test email sent successfully to: " + testEmail,
                    "timestamp", java.time.LocalDateTime.now().toString()
                ));
            } catch (Exception emailError) {
                logger.error("Email sending failed: {}", emailError.getMessage());
                return ResponseEntity.ok(Map.of(
                    "message", "Email test logged but not sent due to authentication issues",
                    "error", emailError.getMessage(),
                    "timestamp", java.time.LocalDateTime.now().toString()
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Test email failed: " + e.getMessage(),
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        }
    }

    @PostMapping("/test-log-only")
    public ResponseEntity<?> testLogOnly(@RequestBody Map<String, String> body) {
        try {
            String testEmail = body.get("email");
            if (testEmail == null) {
                testEmail = "swp391.donateblood@gmail.com";
            }
            
            logger.info("=== LOG ONLY TEST ===");
            logger.info("Email would be sent to: {}", testEmail);
            logger.info("Subject: Test Email - Hệ thống Hiến máu");
            logger.info("Content: Đây là email test để kiểm tra chức năng gửi email thật.");
            logger.info("Time: {}", java.time.LocalDateTime.now());
            logger.info("=== END LOG ONLY TEST ===");
            
            return ResponseEntity.ok(Map.of(
                "message", "Email details logged successfully (no actual email sent)",
                "email", testEmail,
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "Log test failed: " + e.getMessage(),
                "timestamp", java.time.LocalDateTime.now().toString()
            ));
        }
    }

    @GetMapping("/{requestId}/matching-blood")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<List<MatchingBlood>> getMatchingBloodForRequest(@PathVariable Integer requestId) {
        List<MatchingBlood> list = matchingBloodRepository.findByRequestId(requestId);
        return ResponseEntity.ok(list);
    }

    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class SendBloodRequest {
        private List<BloodAmount> sentBlood;
        private String deliveryPerson;
        public List<BloodAmount> getSentBlood() { return sentBlood; }
        public void setSentBlood(List<BloodAmount> sentBlood) { this.sentBlood = sentBlood; }
        public String getDeliveryPerson() { return deliveryPerson; }
        public void setDeliveryPerson(String deliveryPerson) { this.deliveryPerson = deliveryPerson; }
    }
    public static class BloodAmount {
        private String group;
        private Integer amount;
        public String getGroup() { return group; }
        public void setGroup(String group) { this.group = group; }
        public Integer getAmount() { return amount; }
        public void setAmount(Integer amount) { this.amount = amount; }
    }

    public static class ProcessingStatusRequest {
        private String processingStatus;
        public String getProcessingStatus() { return processingStatus; }
        public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }
    }

    public static class EmergencyStatusRequest {
        private String emergencyStatus;
        public String getEmergencyStatus() { return emergencyStatus; }
        public void setEmergencyStatus(String emergencyStatus) { this.emergencyStatus = emergencyStatus; }
    }

    public static class ContactDonorRequest {
        private Integer donorId;
        private Double distanceKm;
        public Integer getDonorId() { return donorId; }
        public void setDonorId(Integer donorId) { this.donorId = donorId; }
        public Double getDistanceKm() { return distanceKm; }
        public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    }
} 