package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.CertificateDTO;
import com.blooddonation.backend.service.admin.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/certificates")
@CrossOrigin(origins = "*")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    /**
     * Tạo certificate từ matching
     * POST /admin/certificates/matching/{matchingId}
     */
    @PostMapping("/matching/{matchingId}")
    public ResponseEntity<CertificateDTO> createCertificateFromMatching(
            @PathVariable Integer matchingId,
            @RequestBody Map<String, Object> request) {
        
        Integer staffId = (Integer) request.get("staffId");
        String notes = (String) request.get("notes");
        
        CertificateDTO certificate = certificateService.createCertificateFromMatching(matchingId, staffId, notes);
        return ResponseEntity.ok(certificate);
    }

    /**
     * Tạo certificate từ register
     * POST /admin/certificates/register/{registerId}
     */
    @PostMapping("/register/{registerId}")
    public ResponseEntity<CertificateDTO> createCertificateFromRegister(
            @PathVariable Integer registerId,
            @RequestBody Map<String, Object> request) {
        Integer staffId = (Integer) request.get("staffId");
        String notes = (String) request.get("notes");
        CertificateDTO certificate = certificateService.createCertificateFromRegister(registerId, staffId, notes);
        return ResponseEntity.ok(certificate);
    }

    /**
     * Lấy tất cả certificates
     * GET /admin/certificates
     */
    @GetMapping
    public ResponseEntity<List<CertificateDTO>> getAllCertificates() {
        return ResponseEntity.ok(certificateService.getAllCertificates());
    }

    /**
     * Lấy certificate theo ID
     * GET /admin/certificates/{certificateId}
     */
    @GetMapping("/{certificateId}")
    public ResponseEntity<CertificateDTO> getCertificateById(@PathVariable Integer certificateId) {
        return ResponseEntity.ok(certificateService.getCertificateById(certificateId));
    }

    /**
     * Lấy certificate theo certificate number
     * GET /admin/certificates/number/{certificateNumber}
     */
    @GetMapping("/number/{certificateNumber}")
    public ResponseEntity<CertificateDTO> getCertificateByNumber(@PathVariable String certificateNumber) {
        return ResponseEntity.ok(certificateService.getCertificateByNumber(certificateNumber));
    }

    /**
     * Lấy certificates theo donor ID
     * GET /admin/certificates/donor/{donorId}
     */
    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<CertificateDTO>> getCertificatesByDonorId(@PathVariable Integer donorId) {
        return ResponseEntity.ok(certificateService.getCertificatesByDonorId(donorId));
    }

    /**
     * Lấy certificates theo matching ID
     * GET /admin/certificates/matching/{matchingId}
     */
    @GetMapping("/matching/{matchingId}")
    public ResponseEntity<List<CertificateDTO>> getCertificatesByMatchingId(@PathVariable Integer matchingId) {
        return ResponseEntity.ok(certificateService.getCertificatesByMatchingId(matchingId));
    }

    /**
     * Lấy certificates theo register ID
     * GET /admin/certificates/register/{registerId}
     */
    @GetMapping("/register/{registerId}")
    public ResponseEntity<List<CertificateDTO>> getCertificatesByRegisterId(@PathVariable Integer registerId) {
        return ResponseEntity.ok(certificateService.getCertificatesByRegisterId(registerId));
    }

    /**
     * Search certificates
     * GET /admin/certificates/search?q={searchTerm}
     */
    @GetMapping("/search")
    public ResponseEntity<List<CertificateDTO>> searchCertificates(@RequestParam String q) {
        return ResponseEntity.ok(certificateService.searchCertificates(q));
    }
} 