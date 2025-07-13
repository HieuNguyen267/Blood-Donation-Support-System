package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.MatchingBloodAdminDTO;
import com.blooddonation.backend.entity.common.MatchingBlood;
import com.blooddonation.backend.entity.admin.BloodRequest;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.admin.MedicalFacility;
import com.blooddonation.backend.repository.common.MatchingBloodRepository;
import com.blooddonation.backend.repository.admin.BloodRequestRepository;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.admin.MedicalFacilityRepository;
import com.blooddonation.backend.repository.admin.BloodGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/matching-blood")
@CrossOrigin(origins = "*")
public class MatchingBloodAdminController {
    @Autowired
    private MatchingBloodRepository matchingBloodRepository;
    @Autowired
    private BloodRequestRepository bloodRequestRepository;
    @Autowired
    private DonorRepository donorRepository;
    @Autowired
    private MedicalFacilityRepository medicalFacilityRepository;
    @Autowired
    private BloodGroupRepository bloodGroupRepository;

    @GetMapping
    public List<MatchingBloodAdminDTO> getAllMatchingBlood() {
        List<MatchingBlood> matchingList = matchingBloodRepository.findAll();
        return matchingList.stream().map(mb -> {
            MatchingBloodAdminDTO dto = new MatchingBloodAdminDTO();
            dto.setMatchingId(mb.getMatchingId());
            dto.setRequestId(mb.getRequestId());
            BloodRequest request = bloodRequestRepository.findById(mb.getRequestId()).orElse(null);
            if (request != null) {
                MedicalFacility facility = request.getFacility();
                dto.setHospitalName(facility != null ? facility.getFacilityName() : null);
                dto.setRequiredBloodGroup(request.getBloodGroup() != null ? request.getBloodGroup().getAboType() + ("positive".equals(request.getBloodGroup().getRhFactor()) ? "+" : "negative".equals(request.getBloodGroup().getRhFactor()) ? "-" : "") : null);
            }
            Donor donor = donorRepository.findById(mb.getDonorId()).orElse(null);
            if (donor != null) {
                dto.setDonorName(donor.getFullName());
                dto.setDonorBloodGroup(donor.getBloodGroup() != null ? donor.getBloodGroup().getAboType() + ("positive".equals(donor.getBloodGroup().getRhFactor()) ? "+" : "negative".equals(donor.getBloodGroup().getRhFactor()) ? "-" : "") : null);
            }
            dto.setContactDate(mb.getNotificationSentAt());
            dto.setStatus(mb.getStatus());
            dto.setQuantityDonated(mb.getQuantityMl());
            dto.setNote(mb.getNotes());
            dto.setDistanceKm(mb.getDistanceKm());
            return dto;
        }).collect(Collectors.toList());
    }
} 