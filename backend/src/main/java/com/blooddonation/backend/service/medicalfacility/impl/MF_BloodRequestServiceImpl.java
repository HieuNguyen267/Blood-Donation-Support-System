package com.blooddonation.backend.service.medicalfacility.impl;

import com.blooddonation.backend.dto.medicalfacility.MF_BloodRequestDTO;
import com.blooddonation.backend.entity.medicalfacility.MF_BloodRequest;
import com.blooddonation.backend.repository.medicalfacility.MF_BloodRequestRepository;
import com.blooddonation.backend.service.medicalfacility.MF_BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MF_BloodRequestServiceImpl implements MF_BloodRequestService {
    @Autowired
    private MF_BloodRequestRepository bloodRequestRepository;

    @Override
    public MF_BloodRequestDTO createBloodRequest(MF_BloodRequestDTO dto) {
        MF_BloodRequest entity = toEntity(dto);
        MF_BloodRequest saved = bloodRequestRepository.save(entity);
        return toDTO(saved);
    }

    @Override
    public List<MF_BloodRequestDTO> getAllBloodRequests() {
        return bloodRequestRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public MF_BloodRequestDTO getBloodRequestById(Integer id) {
        Optional<MF_BloodRequest> entity = bloodRequestRepository.findById(id.longValue());
        return entity.map(this::toDTO).orElse(null);
    }

    @Override
    public boolean deleteBloodRequest(Integer id) {
        Optional<MF_BloodRequest> entity = bloodRequestRepository.findById(id.longValue());
        if (entity.isPresent()) {
            bloodRequestRepository.deleteById(id.longValue());
            return true;
        }
        return false;
    }

    // Mapping methods
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
        
        // Thêm các trường mới
        dto.setIsEmergency(entity.getIsEmergency());
        dto.setPatientInfo(entity.getPatientInfo());
        dto.setIsCompatible(entity.getIsCompatible());
        dto.setBloodFullfilled(entity.getBloodFullfilled());
        dto.setProcessingStatus(entity.getProcessingStatus());
        // Không tự động set emergencyStatus khi tạo yêu cầu mới
        // entity.setEmergencyStatus(dto.getEmergencyStatus());
        dto.setSpecialRequirements(entity.getSpecialRequirements());
        dto.setContactPerson(entity.getContactPerson());
        dto.setContactPhone(entity.getContactPhone());
        dto.setNotes(entity.getNotes());
        dto.setDeliveryPerson(entity.getDeliveryPerson());
        
        return dto;
    }

    private MF_BloodRequest toEntity(MF_BloodRequestDTO dto) {
        MF_BloodRequest entity = new MF_BloodRequest();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        if (dto.getFacilityId() != null) {
            entity.setFacilityId(dto.getFacilityId());
        }
        if (dto.getBloodGroupId() != null) {
            entity.setBloodGroupId(dto.getBloodGroupId());
        }
        entity.setQuantityRequested(dto.getQuantityRequested());
        entity.setRequestStatus(dto.getRequestStatus());
        entity.setCompatibilityRequirement(dto.getCompatibilityRequirement());
        
        // Đặt requiredBy mặc định là 7 ngày từ hiện tại nếu null
        if (dto.getRequiredBy() != null) {
            entity.setRequiredBy(dto.getRequiredBy());
        } else {
            entity.setRequiredBy(LocalDateTime.now().plusDays(7));
        }
        
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        
        // Thêm các trường mới
        entity.setIsEmergency(dto.getIsEmergency() != null ? dto.getIsEmergency() : false);
        entity.setPatientInfo(dto.getPatientInfo());
        entity.setIsCompatible(dto.getIsCompatible() != null ? dto.getIsCompatible() : true);
        entity.setBloodFullfilled(dto.getBloodFullfilled());
        entity.setProcessingStatus(dto.getProcessingStatus());
        // Không tự động set emergencyStatus khi tạo yêu cầu mới
        // entity.setEmergencyStatus(dto.getEmergencyStatus());
        entity.setSpecialRequirements(dto.getSpecialRequirements());
        entity.setContactPerson(dto.getContactPerson());
        entity.setContactPhone(dto.getContactPhone());
        entity.setNotes(dto.getNotes());
        entity.setDeliveryPerson(dto.getDeliveryPerson());
        
        return entity;
    }
} 