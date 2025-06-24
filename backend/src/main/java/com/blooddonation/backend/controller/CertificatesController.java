package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.CertificatesDTO;
import com.blooddonation.backend.entity.Certificates;
import com.blooddonation.backend.repository.CertificatesRepository;
import com.blooddonation.backend.service.MedicalFacilitiesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/certificates")
@CrossOrigin(origins = "*")
public class CertificatesController {
    @Autowired
    private CertificatesRepository certificatesRepository;

    @Autowired
    private MedicalFacilitiesService medicalFacilitiesService;

    @GetMapping
    public ResponseEntity<List<CertificatesDTO>> getAllCertificates() {
        List<CertificatesDTO> list = certificatesRepository.findAll()
                .stream()
                .map(medicalFacilitiesService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificatesDTO> getCertificateById(@PathVariable Integer id) {
        Optional<Certificates> cert = certificatesRepository.findById(id);
        return cert.map(c -> ResponseEntity.ok(medicalFacilitiesService.convertToDTO(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<CertificatesDTO>> getCertificatesByDonor(@PathVariable Integer donorId) {
        List<CertificatesDTO> list = certificatesRepository.findByDonorDonorId(donorId)
                .stream()
                .map(medicalFacilitiesService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/number/{certificateNumber}")
    public ResponseEntity<CertificatesDTO> getCertificateByNumber(@PathVariable String certificateNumber) {
        Optional<Certificates> cert = certificatesRepository.findByCertificateNumber(certificateNumber);
        return cert.map(c -> ResponseEntity.ok(medicalFacilitiesService.convertToDTO(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<CertificatesDTO>> getCertificatesByStatus(@PathVariable String status) {
        List<CertificatesDTO> list = certificatesRepository.findByCertificateStatus(status)
                .stream()
                .map(medicalFacilitiesService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/milestone/{milestoneType}")
    public ResponseEntity<List<CertificatesDTO>> getCertificatesByMilestone(@PathVariable String milestoneType) {
        List<CertificatesDTO> list = certificatesRepository.findByMilestoneType(milestoneType)
                .stream()
                .map(medicalFacilitiesService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<CertificatesDTO>> getCertificatesByDateRange(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        List<CertificatesDTO> list = certificatesRepository.findCertificatesByDateRange(startDate, endDate)
                .stream()
                .map(medicalFacilitiesService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/issuer/{staffId}")
    public ResponseEntity<List<CertificatesDTO>> getCertificatesByIssuer(@PathVariable Integer staffId) {
        List<CertificatesDTO> list = certificatesRepository.findCertificatesByIssuer(staffId)
                .stream()
                .map(medicalFacilitiesService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
} 