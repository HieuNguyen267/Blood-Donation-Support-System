package com.blooddonation.backend.service.medicalfacility.impl;

import com.blooddonation.backend.dto.medicalfacility.MF_BloodRequestDTO;
import com.blooddonation.backend.entity.medicalfacility.MF_BloodRequest;
import com.blooddonation.backend.repository.medicalfacility.MF_BloodRequestRepository;
import com.blooddonation.backend.service.medicalfacility.MF_BloodRequestService;
import com.blooddonation.backend.dto.medicalfacility.MatchingBloodFacilityDTO;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.dto.medicalfacility.BloodRequestSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.entity.donor.Donor;

@Service
public class MF_BloodRequestServiceImpl implements MF_BloodRequestService {
    @Autowired
    private MF_BloodRequestRepository bloodRequestRepository;
    @Autowired
    private MatchingBloodRepository matchingBloodRepository;
    @Autowired
    private DonorRepository donorRepository;

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
        Optional<MF_BloodRequest> entity = bloodRequestRepository.findByRequestId(id);
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

    @Override
    public List<MF_BloodRequestDTO> getBloodRequestHistory() {
        // Có thể lọc theo facility/account nếu cần, tạm thời trả về tất cả
        return bloodRequestRepository.findAll().stream().map(this::toDTO).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public List<MatchingBloodFacilityDTO> getAcceptedMatchingByRequestId(Integer requestId) {
        List<Object[]> rows = matchingBloodRepository.findAcceptedMatchingWithDonorInfoByRequestId(requestId);
        List<MatchingBloodFacilityDTO> result = new java.util.ArrayList<>();
        for (Object[] row : rows) {
            MatchingBlood m = (MatchingBlood) row[0];
            MatchingBloodFacilityDTO dto = new MatchingBloodFacilityDTO();
            dto.setMatchingId(m.getMatchingId());
            dto.setRequestId(m.getRequestId());
            dto.setDonorId(m.getDonorId());
            dto.setFacilityId(m.getFacilityId());
            dto.setDistanceKm(m.getDistanceKm());
            dto.setNotificationSentAt(m.getNotificationSentAt());
            dto.setStatus(m.getStatus());
            dto.setResponseTime(m.getResponseTime());
            dto.setArrivalTime(m.getArrivalTime());
            dto.setQuantityMl(m.getQuantityMl());
            dto.setNotes(m.getNotes());
            dto.setCreatedAt(m.getCreatedAt());
            dto.setUpdatedAt(m.getUpdatedAt());
            // Donor & blood group info
            dto.setFullName((String) row[1]);
            dto.setDateOfBirth((java.time.LocalDate) row[2]);
            dto.setPhone((String) row[3]);
            dto.setAddress((String) row[4]);
            dto.setAboType((String) row[5]);
            dto.setRhFactor((String) row[6]);
            result.add(dto);
        }
        return result;
    }

    @Override
    public BloodRequestSummaryDTO getBloodRequestSummary(Integer requestId) {
        Optional<MF_BloodRequest> entityOpt = bloodRequestRepository.findByRequestId(requestId);
        MF_BloodRequest entity = entityOpt.orElse(null);
        BloodRequestSummaryDTO summary = new BloodRequestSummaryDTO();
        if (entity == null) return summary;
        // Tổng máu từ bloodFullfilled
        String bloodFullfilled = entity.getBloodFullfilled();
        int totalBloodFullfilled = parseBloodFullfilled(bloodFullfilled);
        // Tổng máu từ accepted donors
        List<Object[]> rows = matchingBloodRepository.findAcceptedMatchingWithDonorInfoByRequestId(requestId);
        int totalAccepted = rows.size();
        int totalAcceptedBlood = 0;
        for (Object[] row : rows) {
            MatchingBlood m = (MatchingBlood) row[0];
            if (m.getQuantityMl() != null) totalAcceptedBlood += m.getQuantityMl();
        }
        int totalBlood = totalAcceptedBlood + totalBloodFullfilled;
        int quantityRequested = entity.getQuantityRequested() != null ? entity.getQuantityRequested() : 0;
        int remainingNeeded = Math.max(quantityRequested - totalBlood, 0);
        int progressPercent = quantityRequested > 0 ? Math.min((totalBlood * 100) / quantityRequested, 100) : 0;
        summary.setTotalAccepted(totalAccepted);
        summary.setTotalAcceptedBlood(totalAcceptedBlood);
        summary.setTotalBloodFullfilled(totalBloodFullfilled);
        summary.setTotalBlood(totalBlood);
        summary.setQuantityRequested(quantityRequested);
        summary.setRemainingNeeded(remainingNeeded);
        summary.setProgressPercent(progressPercent);
        return summary;
    }

    // Thêm hàm hoàn thành quá trình khẩn cấp
    @Override
    public void completeEmergencyProcess(Integer requestId) {
        // 1. Cập nhật emergency_status của blood_request
        Optional<MF_BloodRequest> entityOpt = bloodRequestRepository.findByRequestId(requestId);
        if (entityOpt.isPresent()) {
            MF_BloodRequest entity = entityOpt.get();
            entity.setEmergencyStatus("completed");
            bloodRequestRepository.save(entity);
        }
        // 2. Cập nhật status của các matching_blood liên quan có quantityMl != null
        List<MatchingBlood> matchings = matchingBloodRepository.findByRequestId(requestId);
        for (MatchingBlood m : matchings) {
            if (m.getQuantityMl() != null) {
                m.setStatus("completed");
                // Cập nhật donor
                com.blooddonation.backend.entity.donor.Donor donor = donorRepository.findById(m.getDonorId()).orElse(null);
                if (donor != null) {
                    if (m.getArrivalTime() != null) {
                        donor.setLastDonationDate(m.getArrivalTime().toLocalDate());
                    }
                    donor.setIsEligible(false);
                    donor.setAvailableFrom(null);
                    donor.setAvailableUntil(null);
                    donorRepository.save(donor);
                }
            }
        }
        matchingBloodRepository.saveAll(matchings);
    }

    private int parseBloodFullfilled(String str) {
        if (str == null || str.isEmpty()) return 0;
        int sum = 0;
        String[] parts = str.split(",");
        for (String part : parts) {
            java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("(\\d+)\\s*ml").matcher(part);
            if (matcher.find()) {
                sum += Integer.parseInt(matcher.group(1));
            }
        }
        return sum;
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
        // Map thêm thông tin cơ sở y tế
        if (entity.getFacility() != null) {
            dto.setFacilityName(entity.getFacility().getFacilityName());
            dto.setFacilityAddress(entity.getFacility().getAddress());
            dto.setFacilityPhone(entity.getFacility().getPhone());
            dto.setFacilityEmail(entity.getFacility().getEmail());
        }
        // Map thêm thông tin nhóm máu
        if (entity.getBloodGroup() != null) {
            dto.setBloodGroupAboType(entity.getBloodGroup().getAboType());
            dto.setBloodGroupRhFactor(entity.getBloodGroup().getRhFactor());
        }
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