package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.MedicalFacilityDTO;
import com.blooddonation.backend.entity.admin.MedicalFacility;
import com.blooddonation.backend.repository.admin.MedicalFacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicalFacilityService {
    @Autowired
    private MedicalFacilityRepository medicalFacilityRepository;

    private static final DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public List<MedicalFacilityDTO> getAllFacilities() {
        return medicalFacilityRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<MedicalFacilityDTO> getFacilityById(Long id) {
        return medicalFacilityRepository.findById(id).map(this::toDTO);
    }

    public MedicalFacilityDTO createFacility(MedicalFacilityDTO dto) {
        if (medicalFacilityRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }
        MedicalFacility entity = toEntity(dto);
        MedicalFacility saved = medicalFacilityRepository.save(entity);
        return toDTO(saved);
    }

    public MedicalFacilityDTO updateFacility(Long id, MedicalFacilityDTO dto) {
        MedicalFacility entity = medicalFacilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical facility not found"));
        
        // Kiểm tra duplicate license number (trừ facility hiện tại)
        if (!dto.getLicenseNumber().equals(entity.getLicenseNumber()) && 
            medicalFacilityRepository.existsByLicenseNumber(dto.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }
        
        entity.setFacilityName(dto.getFacilityName());
        entity.setLicenseNumber(dto.getLicenseNumber());
        entity.setAddress(dto.getAddress());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        entity.setAccountId(dto.getAccountId());
        MedicalFacility saved = medicalFacilityRepository.save(entity);
        return toDTO(saved);
    }

    public void deleteFacility(Long id) {
        medicalFacilityRepository.deleteById(id);
    }

    private MedicalFacilityDTO toDTO(MedicalFacility entity) {
        return new MedicalFacilityDTO(
                entity.getFacilityId(),
                entity.getAccountId(),
                entity.getFacilityName(),
                entity.getLicenseNumber(),
                entity.getAddress(),
                entity.getPhone(),
                entity.getEmail(),
                entity.getCreatedAt() != null ? entity.getCreatedAt().format(dtf) : null,
                entity.getUpdatedAt() != null ? entity.getUpdatedAt().format(dtf) : null
        );
    }

    private MedicalFacility toEntity(MedicalFacilityDTO dto) {
        MedicalFacility entity = new MedicalFacility();
        entity.setFacilityId(dto.getFacilityId());
        entity.setAccountId(dto.getAccountId());
        entity.setFacilityName(dto.getFacilityName());
        entity.setLicenseNumber(dto.getLicenseNumber());
        entity.setAddress(dto.getAddress());
        entity.setPhone(dto.getPhone());
        entity.setEmail(dto.getEmail());
        return entity;
    }
} 