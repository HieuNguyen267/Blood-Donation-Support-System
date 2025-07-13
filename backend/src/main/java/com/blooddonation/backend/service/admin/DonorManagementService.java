package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.DonorManagementDTO;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.common.Account;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.common.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DonorManagementService {
    
    @Autowired
    private DonorRepository donorRepository;
    
    @Autowired
    private AccountRepository accountRepository;
    
    public List<DonorManagementDTO> getAllDonors() {
        List<Donor> donors = donorRepository.findAll();
        return donors.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<DonorManagementDTO> getDonorById(Integer id) {
        return donorRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public DonorManagementDTO updateDonorEligibility(Integer id, Boolean isEligible) {
        Optional<Donor> donor = donorRepository.findById(id);
        if (donor.isEmpty()) {
            throw new RuntimeException("Donor not found");
        }
        
        Donor donorEntity = donor.get();
        donorEntity.setIsEligible(isEligible);
        Donor updatedDonor = donorRepository.save(donorEntity);
        return convertToDTO(updatedDonor);
    }
    
    public List<DonorManagementDTO> getDonorsByEligibility(Boolean isEligible) {
        List<Donor> donors = donorRepository.findAll();
        return donors.stream()
                .filter(donor -> {
                    Boolean donorEligible = donor.getIsEligible();
                    if (isEligible == null) {
                        return donorEligible == null;
                    }
                    return isEligible.equals(donorEligible);
                })
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<DonorManagementDTO> getDonorsByBloodGroup(Integer bloodGroupId) {
        List<Donor> donors = donorRepository.findByBloodGroupBloodGroupId(bloodGroupId);
        return donors.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public void deleteDonor(Integer id) {
        if (!donorRepository.existsById(id)) {
            throw new RuntimeException("Donor not found");
        }
        donorRepository.deleteById(id);
    }
    
    private DonorManagementDTO convertToDTO(Donor donor) {
        DonorManagementDTO dto = new DonorManagementDTO();
        dto.setId(donor.getDonorId().longValue());
        dto.setFullName(donor.getFullName());
        dto.setGender(donor.getGender());
        dto.setPhone(donor.getPhone());
        dto.setAddress(donor.getAddress());
        
        // Format blood group: abo_type + rh_factor (positive -> +, negative -> -)
        String aboType = donor.getBloodGroup().getAboType();
        String rhFactor = donor.getBloodGroup().getRhFactor();
        String rhSymbol = "positive".equalsIgnoreCase(rhFactor) ? "+" : 
                         "negative".equalsIgnoreCase(rhFactor) ? "-" : rhFactor;
        dto.setBloodGroup(aboType + rhSymbol);
        
        // Calculate age
        if (donor.getDateOfBirth() != null) {
            int age = Period.between(donor.getDateOfBirth(), LocalDate.now()).getYears();
            dto.setAge(age);
        } else {
            dto.setAge(null);
        }
        
        dto.setEmail(donor.getEmail());
        dto.setLastDonationDate(donor.getLastDonationDate() != null ? donor.getLastDonationDate().toString() : null);
        dto.setTotalDonations(donor.getTotalDonations());
        
        // Convert isEligible to Vietnamese
        Boolean isEligible = donor.getIsEligible();
        dto.setIsEligible((isEligible != null && isEligible) ? "Có" : "Không");
        
        return dto;
    }
} 