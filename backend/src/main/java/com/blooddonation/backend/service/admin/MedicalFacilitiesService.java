package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.MedicalFacilitiesDTO;
import com.blooddonation.backend.entity.admin.MedicalFacilities;
import com.blooddonation.backend.repository.admin.MedicalFacilitiesRepository;
import com.blooddonation.backend.repository.common.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.blooddonation.backend.dto.common.EventDTO;
import com.blooddonation.backend.entity.common.Event;
import com.blooddonation.backend.dto.admin.CertificatesDTO;
import com.blooddonation.backend.entity.admin.Certificates;
import com.blooddonation.backend.repository.admin.CertificatesRepository;
import com.blooddonation.backend.dto.common.MatchingBloodDTO;
import com.blooddonation.backend.entity.common.MatchingBlood;

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
        return medicalFacilitiesRepository.findAll()
                .stream()
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

    private MedicalFacilitiesDTO convertToDTO(MedicalFacilities entity) {
        MedicalFacilitiesDTO dto = new MedicalFacilitiesDTO();
        dto.setFacilityId(entity.getFacilityId());
        dto.setAccountId(entity.getAccount() != null ? entity.getAccount().getAccountId() : null);
        dto.setFacilityName(entity.getFacilityName());
        dto.setFacilityType(entity.getFacilityType());
        dto.setLicenseNumber(entity.getLicenseNumber());
        dto.setAddress(entity.getAddress());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
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

    public EventDTO convertToDTO(Event entity) {
        EventDTO dto = new EventDTO();
        dto.setEventId(entity.getEventId());
        dto.setEventName(entity.getEventName());
        dto.setDescription(entity.getDescription());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setTargetDonors(entity.getTargetDonors());
        dto.setRegisteredDonors(entity.getRegisteredDonors());
        dto.setActualDonors(entity.getActualDonors());
        dto.setTargetBloodUnits(entity.getTargetBloodUnits());
        dto.setCollectedBloodUnits(entity.getCollectedBloodUnits());
        dto.setOrganizer(entity.getOrganizer());
        dto.setContactPhone(entity.getContactPhone());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public CertificatesDTO convertToDTO(Certificates entity) {
        CertificatesDTO dto = new CertificatesDTO();
        dto.setCertificateId(entity.getCertificateId());
        dto.setDonorId(entity.getDonor().getDonorId());
        dto.setDonorName(entity.getDonor().getFullName());
        dto.setRegisterId(entity.getDonationRegister() != null ? entity.getDonationRegister().getRegisterId() : null);
        dto.setMatchingId(entity.getMatchingBlood() != null ? entity.getMatchingBlood().getMatchingId() : null);
        dto.setCertificateNumber(entity.getCertificateNumber());
        dto.setDonationDate(entity.getDonationDate());
        dto.setBloodVolume(entity.getBloodVolume());
        dto.setDonationLocation(entity.getDonationLocation());
        dto.setMilestoneType(entity.getMilestoneType());
        dto.setIssuedDate(entity.getIssuedDate());
        dto.setIssuedBy(entity.getIssuedBy());
        dto.setIssuedByStaffId(entity.getIssuedByStaff().getStaffId());
        dto.setIssuedByStaffName(entity.getIssuedByStaff().getFullName());
        dto.setDigitalSignature(entity.getDigitalSignature());
        dto.setQrCode(entity.getQrCode());
        dto.setVerificationCode(entity.getVerificationCode());
        dto.setIsVerified(entity.getIsVerified());
        dto.setCertificateStatus(entity.getCertificateStatus());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public MatchingBloodDTO convertToDTO(MatchingBlood entity) {
        MatchingBloodDTO dto = new MatchingBloodDTO();
        dto.setMatchingId(entity.getMatchingId());
        dto.setRequestId(entity.getBloodRequest().getRequestId());
        dto.setDonorId(entity.getDonor().getDonorId());
        dto.setDonorName(entity.getDonor().getFullName());
        dto.setDistanceKm(entity.getDistanceKm());
        dto.setNotificationSentAt(entity.getNotificationSentAt());
        dto.setDonorResponse(entity.getDonorResponse());
        dto.setResponseTime(entity.getResponseTime());
        dto.setEstimatedArrivalTime(entity.getEstimatedArrivalTime());
        dto.setActualArrivalTime(entity.getActualArrivalTime());
        dto.setDonationCompleted(entity.getDonationCompleted());
        dto.setDonationCompletionTime(entity.getDonationCompletionTime());
        dto.setFacilityConfirmation(entity.getFacilityConfirmation());
        dto.setFacilityConfirmationTime(entity.getFacilityConfirmationTime());
        dto.setNotes(entity.getNotes());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
} 