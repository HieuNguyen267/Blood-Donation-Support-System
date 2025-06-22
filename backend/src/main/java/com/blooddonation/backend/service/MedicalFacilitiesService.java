package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.MedicalFacilitiesDTO;
import com.blooddonation.backend.entity.MedicalFacilities;
import com.blooddonation.backend.entity.Account;
import com.blooddonation.backend.repository.MedicalFacilitiesRepository;
import com.blooddonation.backend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicalFacilitiesService {

    @Autowired
    private MedicalFacilitiesRepository medicalFacilitiesRepository;

    @Autowired
    private AccountRepository accountRepository;

    public List<MedicalFacilitiesDTO> getAllMedicalFacilities() {
        return medicalFacilitiesRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<MedicalFacilitiesDTO> getMedicalFacilityById(Integer id) {
        return medicalFacilitiesRepository.findById(id)
                .map(this::convertToDTO);
    }

    public Optional<MedicalFacilitiesDTO> getMedicalFacilityByLicenseNumber(String licenseNumber) {
        return medicalFacilitiesRepository.findByLicenseNumber(licenseNumber)
                .map(this::convertToDTO);
    }

    public List<MedicalFacilitiesDTO> getMedicalFacilitiesByType(String facilityType) {
        return medicalFacilitiesRepository.findByFacilityType(facilityType).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MedicalFacilitiesDTO> searchMedicalFacilitiesByName(String name) {
        return medicalFacilitiesRepository.findByFacilityNameContaining(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MedicalFacilitiesDTO createMedicalFacility(MedicalFacilitiesDTO facilityDTO) {
        if (medicalFacilitiesRepository.existsByLicenseNumber(facilityDTO.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }

        MedicalFacilities facility = convertToEntity(facilityDTO);
        facility.setCreatedAt(LocalDateTime.now());
        facility.setUpdatedAt(LocalDateTime.now());
        
        MedicalFacilities savedFacility = medicalFacilitiesRepository.save(facility);
        return convertToDTO(savedFacility);
    }

    public MedicalFacilitiesDTO updateMedicalFacility(Integer id, MedicalFacilitiesDTO facilityDTO) {
        Optional<MedicalFacilities> existingFacility = medicalFacilitiesRepository.findById(id);
        if (existingFacility.isPresent()) {
            MedicalFacilities facility = existingFacility.get();
            
            // Check if license number is being changed and if it already exists
            if (!facility.getLicenseNumber().equals(facilityDTO.getLicenseNumber()) &&
                medicalFacilitiesRepository.existsByLicenseNumber(facilityDTO.getLicenseNumber())) {
                throw new RuntimeException("License number already exists");
            }
            
            updateEntityFromDTO(facility, facilityDTO);
            facility.setUpdatedAt(LocalDateTime.now());
            
            MedicalFacilities savedFacility = medicalFacilitiesRepository.save(facility);
            return convertToDTO(savedFacility);
        }
        return null;
    }

    public boolean deleteMedicalFacility(Integer id) {
        if (medicalFacilitiesRepository.existsById(id)) {
            medicalFacilitiesRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean existsByLicenseNumber(String licenseNumber) {
        return medicalFacilitiesRepository.existsByLicenseNumber(licenseNumber);
    }

    private MedicalFacilitiesDTO convertToDTO(MedicalFacilities facility) {
        MedicalFacilitiesDTO dto = new MedicalFacilitiesDTO();
        dto.setFacilityId(facility.getFacilityId());
        if (facility.getAccount() != null) {
            dto.setAccountId(facility.getAccount().getAccountId());
        }
        dto.setFacilityName(facility.getFacilityName());
        dto.setFacilityType(facility.getFacilityType());
        dto.setLicenseNumber(facility.getLicenseNumber());
        dto.setAddress(facility.getAddress());
        dto.setPhone(facility.getPhone());
        dto.setEmail(facility.getEmail());
        dto.setCreatedAt(facility.getCreatedAt());
        dto.setUpdatedAt(facility.getUpdatedAt());
        return dto;
    }

    private MedicalFacilities convertToEntity(MedicalFacilitiesDTO dto) {
        MedicalFacilities facility = new MedicalFacilities();
        updateEntityFromDTO(facility, dto);
        return facility;
    }

    private void updateEntityFromDTO(MedicalFacilities facility, MedicalFacilitiesDTO dto) {
        if (dto.getAccountId() != null) {
            accountRepository.findById(dto.getAccountId())
                    .ifPresent(facility::setAccount);
        }
        if (dto.getFacilityName() != null) {
            facility.setFacilityName(dto.getFacilityName());
        }
        if (dto.getFacilityType() != null) {
            facility.setFacilityType(dto.getFacilityType());
        }
        if (dto.getLicenseNumber() != null) {
            facility.setLicenseNumber(dto.getLicenseNumber());
        }
        if (dto.getAddress() != null) {
            facility.setAddress(dto.getAddress());
        }
        if (dto.getPhone() != null) {
            facility.setPhone(dto.getPhone());
        }
        if (dto.getEmail() != null) {
            facility.setEmail(dto.getEmail());
        }
    }
} 