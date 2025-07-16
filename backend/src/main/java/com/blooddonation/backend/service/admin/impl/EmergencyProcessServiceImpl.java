package com.blooddonation.backend.service.admin.impl;

import com.blooddonation.backend.dto.admin.MatchingBloodAdminDTO;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.service.admin.EmergencyProcessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmergencyProcessServiceImpl implements EmergencyProcessService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private MatchingBloodRepository matchingBloodRepository;

    private MatchingBloodAdminDTO toDTO(MatchingBlood m) {
        MatchingBloodAdminDTO dto = new MatchingBloodAdminDTO();
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
        return dto;
    }

    @Override
    public List<MatchingBloodAdminDTO> getAcceptedDonorsByRequestId(Integer requestId) {
        List<MatchingBlood> matchings = matchingBloodRepository.findByRequestId(requestId);
        return matchings.stream()
            .filter(m -> "contact_successful".equals(m.getStatus()) || "completed".equals(m.getStatus()))
            .map(m -> {
                MatchingBloodAdminDTO dto = toDTO(m);
                Donor donor = donorRepository.findById(m.getDonorId()).orElse(null);
                if (donor != null) {
                    dto.setFullName(donor.getFullName());
                    dto.setDateOfBirth(donor.getDateOfBirth());
                    dto.setPhone(donor.getPhone());
                    dto.setAddress(donor.getAddress());
                    if (donor.getBloodGroup() != null) {
                        dto.setAboType(donor.getBloodGroup().getAboType());
                        dto.setRhFactor(donor.getBloodGroup().getRhFactor());
                    }
                }
                return dto;
            })
            .collect(Collectors.toList());
    }
} 