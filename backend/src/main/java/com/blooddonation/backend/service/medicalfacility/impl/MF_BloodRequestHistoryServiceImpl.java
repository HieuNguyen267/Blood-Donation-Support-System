package com.blooddonation.backend.service.medicalfacility.impl;

import com.blooddonation.backend.dto.medicalfacility.MF_BloodRequestDTO;
import com.blooddonation.backend.entity.medicalfacility.MF_BloodRequest;
import com.blooddonation.backend.repository.medicalfacility.MF_BloodRequestRepository;
import com.blooddonation.backend.service.medicalfacility.MF_BloodRequestHistoryService;
import com.blooddonation.backend.repository.common.AccountRepository;
import com.blooddonation.backend.repository.admin.MedicalFacilityRepository;
import com.blooddonation.backend.entity.common.Account;
import com.blooddonation.backend.entity.admin.MedicalFacility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MF_BloodRequestHistoryServiceImpl implements MF_BloodRequestHistoryService {
    @Autowired
    private MF_BloodRequestRepository repository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private MedicalFacilityRepository medicalFacilityRepository;

    @Override
    public List<MF_BloodRequestDTO> getBloodRequestHistory() {
        // Get current user email from security context
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Account account = accountRepository.findByEmail(email).orElse(null);
        if (account == null) return List.of();
        MedicalFacility facility = medicalFacilityRepository.findByAccountId(account.getAccountId());
        if (facility == null) return List.of();
        List<MF_BloodRequest> requests = repository.findAll().stream()
            .filter(r -> r.getFacilityId() != null && r.getFacilityId().equals(facility.getFacilityId().intValue()))
            .collect(Collectors.toList());
        return requests.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private MF_BloodRequestDTO toDTO(MF_BloodRequest entity) {
        MF_BloodRequestDTO dto = new MF_BloodRequestDTO();
        dto.setId(entity.getId());
        dto.setFacilityId(entity.getFacilityId());
        dto.setBloodGroupId(entity.getBloodGroupId());
        dto.setQuantityRequested(entity.getQuantityRequested());
        dto.setRequestStatus(entity.getRequestStatus());
        dto.setCompatibilityRequirement(entity.getCompatibilityRequirement());
        dto.setRequiredBy(entity.getRequiredBy());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setIsEmergency(entity.getIsEmergency());
        dto.setPatientInfo(entity.getPatientInfo());
        dto.setIsCompatible(entity.getIsCompatible());
        dto.setBloodFullfilled(entity.getBloodFullfilled());
        dto.setProcessingStatus(entity.getProcessingStatus());
        dto.setEmergencyStatus(entity.getEmergencyStatus());
        dto.setSpecialRequirements(entity.getSpecialRequirements());
        dto.setContactPerson(entity.getContactPerson());
        dto.setContactPhone(entity.getContactPhone());
        dto.setNotes(entity.getNotes());
        dto.setDeliveryPerson(entity.getDeliveryPerson());
        return dto;
    }
} 