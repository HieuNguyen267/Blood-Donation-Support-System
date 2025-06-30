package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.BloodRequestDTO;
import com.blooddonation.backend.entity.admin.BloodRequest;
import com.blooddonation.backend.entity.admin.MedicalFacilities;
import com.blooddonation.backend.repository.admin.BloodRequestRepository;
import com.blooddonation.backend.repository.admin.BloodGroupRepository;
import com.blooddonation.backend.repository.admin.MedicalFacilitiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private BloodGroupRepository bloodGroupRepository;

    @Autowired
    private MedicalFacilitiesRepository medicalFacilitiesRepository;

    public List<BloodRequestDTO> getAllBloodRequests() {
        return bloodRequestRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<BloodRequestDTO> getBloodRequestById(Integer id) {
        return bloodRequestRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<BloodRequestDTO> getBloodRequestsByFacility(Integer facilityId) {
        return bloodRequestRepository.findByFacilityFacilityId(facilityId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodRequestDTO> getBloodRequestsByStatus(String status) {
        return bloodRequestRepository.findByRequestStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodRequestDTO> getUrgentRequests() {
        LocalDateTime deadline = LocalDateTime.now().plusHours(24);
        return bloodRequestRepository.findUrgentRequests(deadline).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BloodRequestDTO createBloodRequest(BloodRequestDTO requestDTO) {
        System.out.println("[DEBUG] facilityId nhận được: " + requestDTO.getFacilityId());
        BloodRequest bloodRequest = convertToEntity(requestDTO);
        bloodRequest.setCreatedAt(LocalDateTime.now());
        bloodRequest.setUpdatedAt(LocalDateTime.now());
        bloodRequest.setRequestStatus("pending");
        bloodRequest.setQuantityFulfilled(0);
        
        BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
        return convertToDTO(savedRequest);
    }

    public BloodRequestDTO updateBloodRequest(Integer id, BloodRequestDTO requestDTO) {
        Optional<BloodRequest> existingRequest = bloodRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            BloodRequest bloodRequest = existingRequest.get();
            updateEntityFromDTO(bloodRequest, requestDTO);
            bloodRequest.setUpdatedAt(LocalDateTime.now());
            
            BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
            return convertToDTO(savedRequest);
        }
        return null;
    }

    public boolean deleteBloodRequest(Integer id) {
        if (bloodRequestRepository.existsById(id)) {
            bloodRequestRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public BloodRequestDTO updateRequestStatus(Integer id, String status) {
        Optional<BloodRequest> existingRequest = bloodRequestRepository.findById(id);
        if (existingRequest.isPresent()) {
            BloodRequest bloodRequest = existingRequest.get();
            bloodRequest.setRequestStatus(status);
            bloodRequest.setUpdatedAt(LocalDateTime.now());
            
            BloodRequest savedRequest = bloodRequestRepository.save(bloodRequest);
            return convertToDTO(savedRequest);
        }
        return null;
    }

    private BloodRequestDTO convertToDTO(BloodRequest bloodRequest) {
        BloodRequestDTO dto = new BloodRequestDTO();
        dto.setRequestId(bloodRequest.getRequestId());
        dto.setFacilityId(bloodRequest.getFacility().getFacilityId());
        dto.setFacilityName(bloodRequest.getFacility().getFacilityName());
        dto.setBloodGroupId(bloodRequest.getBloodGroup().getBloodGroupId());
        dto.setBloodGroupName(bloodRequest.getBloodGroup().getAboType() + bloodRequest.getBloodGroup().getRhFactor());
        dto.setQuantityRequested(bloodRequest.getQuantityRequested());
        dto.setUrgencyLevel(bloodRequest.getUrgencyLevel());
        dto.setPatientInfo(bloodRequest.getPatientInfo());
        dto.setRequiredBy(bloodRequest.getRequiredBy());
        dto.setQuantityFulfilled(bloodRequest.getQuantityFulfilled());
        dto.setRequestStatus(bloodRequest.getRequestStatus());
        dto.setSpecialRequirements(bloodRequest.getSpecialRequirements());
        dto.setContactPerson(bloodRequest.getContactPerson());
        dto.setContactPhone(bloodRequest.getContactPhone());
        dto.setNotes(bloodRequest.getNotes());
        dto.setStockId(bloodRequest.getStockId());
        dto.setDeliveryPerson(bloodRequest.getDeliveryPerson());
        dto.setCreatedAt(bloodRequest.getCreatedAt());
        dto.setUpdatedAt(bloodRequest.getUpdatedAt());
        return dto;
    }

    private BloodRequest convertToEntity(BloodRequestDTO dto) {
        BloodRequest bloodRequest = new BloodRequest();
        updateEntityFromDTO(bloodRequest, dto);
        return bloodRequest;
    }

    private void updateEntityFromDTO(BloodRequest bloodRequest, BloodRequestDTO dto) {
        if (dto.getFacilityId() != null) {
            MedicalFacilities facility = medicalFacilitiesRepository.findById(dto.getFacilityId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ sở y tế với id: " + dto.getFacilityId()));
            bloodRequest.setFacility(facility);
        }
        if (dto.getBloodGroupId() != null) {
            bloodGroupRepository.findById(dto.getBloodGroupId())
                    .ifPresent(bloodRequest::setBloodGroup);
        }
        if (dto.getQuantityRequested() != null) {
            bloodRequest.setQuantityRequested(dto.getQuantityRequested());
        }
        if (dto.getUrgencyLevel() != null) {
            bloodRequest.setUrgencyLevel(dto.getUrgencyLevel());
        }
        if (dto.getPatientInfo() != null) {
            bloodRequest.setPatientInfo(dto.getPatientInfo());
        }
        if (dto.getRequiredBy() != null) {
            bloodRequest.setRequiredBy(dto.getRequiredBy());
        }
        if (dto.getQuantityFulfilled() != null) {
            bloodRequest.setQuantityFulfilled(dto.getQuantityFulfilled());
        }
        if (dto.getRequestStatus() != null) {
            bloodRequest.setRequestStatus(dto.getRequestStatus());
        }
        if (dto.getSpecialRequirements() != null) {
            bloodRequest.setSpecialRequirements(dto.getSpecialRequirements());
        }
        if (dto.getContactPerson() != null) {
            bloodRequest.setContactPerson(dto.getContactPerson());
        }
        if (dto.getContactPhone() != null) {
            bloodRequest.setContactPhone(dto.getContactPhone());
        }
        if (dto.getNotes() != null) {
            bloodRequest.setNotes(dto.getNotes());
        }
        if (dto.getStockId() != null) {
            bloodRequest.setStockId(dto.getStockId());
        }
        if (dto.getDeliveryPerson() != null) {
            bloodRequest.setDeliveryPerson(dto.getDeliveryPerson());
        }
    }
} 