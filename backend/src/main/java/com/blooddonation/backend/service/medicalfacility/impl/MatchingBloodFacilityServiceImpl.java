package com.blooddonation.backend.service.medicalfacility.impl;

import com.blooddonation.backend.dto.medicalfacility.MatchingBloodFacilityDTO;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.service.medicalfacility.MatchingBloodFacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingBloodFacilityServiceImpl implements MatchingBloodFacilityService {
    @Autowired
    private MatchingBloodRepository matchingBloodRepository;
    @Autowired
    private DonorRepository donorRepository;

    @Override
    public List<MatchingBloodFacilityDTO> getMatchingByRequestId(Integer requestId) {
        List<MatchingBlood> list = matchingBloodRepository.findByRequestId(requestId);
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void updateQuantityMl(Integer matchingId, Integer quantityMl) {
        MatchingBlood mb = matchingBloodRepository.findById(matchingId).orElse(null);
        if (mb != null) {
            mb.setQuantityMl(quantityMl);
            mb.setUpdatedAt(java.time.LocalDateTime.now());
            if (quantityMl != null && quantityMl > 0) {
                mb.setArrivalTime(java.time.LocalDateTime.now());
            }
            matchingBloodRepository.save(mb);
        }
    }

    @Override
    public void confirmCompleted(Integer matchingId) {
        MatchingBlood mb = matchingBloodRepository.findById(matchingId).orElse(null);
        if (mb != null) {
            mb.setStatus("completed");
            mb.setUpdatedAt(java.time.LocalDateTime.now());
            matchingBloodRepository.save(mb);

            Donor donor = donorRepository.findById(mb.getDonorId()).orElse(null);
            if (donor != null) {
                donor.setIsEligible(false);
                donor.setAvailableFrom(null);
                donor.setAvailableUntil(null);
                java.time.LocalDate arrivalDate = mb.getArrivalTime() != null ? mb.getArrivalTime().toLocalDate() : java.time.LocalDate.now();
                donor.setLastDonationDate(arrivalDate);
                donor.setUpdatedAt(java.time.LocalDateTime.now());
                donorRepository.save(donor);
            }
        }
    }

    private MatchingBloodFacilityDTO toDTO(MatchingBlood entity) {
        MatchingBloodFacilityDTO dto = new MatchingBloodFacilityDTO();
        dto.setMatchingId(entity.getMatchingId());
        dto.setRequestId(entity.getRequestId());
        dto.setDonorId(entity.getDonorId());
        dto.setFacilityId(entity.getFacilityId());
        dto.setDistanceKm(entity.getDistanceKm());
        dto.setNotificationSentAt(entity.getNotificationSentAt());
        dto.setStatus(entity.getStatus());
        dto.setResponseTime(entity.getResponseTime());
        dto.setArrivalTime(entity.getArrivalTime());
        dto.setQuantityMl(entity.getQuantityMl());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
} 