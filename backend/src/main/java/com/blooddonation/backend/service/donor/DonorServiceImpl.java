package com.blooddonation.backend.service.donor;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.repository.donor.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.blooddonation.backend.dto.donor.DonorDTO;
import com.blooddonation.backend.entity.admin.BloodGroup;
import com.blooddonation.backend.repository.admin.BloodGroupRepository;
import java.time.LocalDate;
import java.util.List;

@Service
public class DonorServiceImpl implements DonorService {
    private final DonorRepository donorRepository;
    @Autowired
    private BloodGroupRepository bloodGroupRepository;

    public DonorServiceImpl(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @Override
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    @Override
    public Donor getDonorById(Integer id) {
        return donorRepository.findById(id).orElse(null);
    }

    @Override
    public Donor saveDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    @Override
    public void deleteDonor(Integer id) {
        donorRepository.deleteById(id);
    }

    @Override
    public Donor getDonorByEmail(String email) {
        Donor donor = donorRepository.findByEmail(email).orElse(null);
        if (donor != null && donor.getAvailableUntil() != null) {
            java.time.LocalDate today = java.time.LocalDate.now();
            if (donor.getAvailableUntil().isBefore(today)) {
                donor.setIsEligible(false);
                donor.setAvailableFrom(null);
                donor.setAvailableUntil(null);
                donorRepository.save(donor);
            }
        }
        return donor;
    }

    @Override
    public List<Donor> getEligibleDonors() {
        return donorRepository.findEligibleDonors();
    }

    public Donor saveOrUpdateDonorFromDTO(DonorDTO dto, Donor donor) {
        donor.setFullName(dto.getFullName());
        if (dto.getDateOfBirth() != null) {
            donor.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
        }
        donor.setGender(dto.getGender());
        donor.setAddress(dto.getAddress());
        donor.setPhone(dto.getPhone());
        donor.setEmail(dto.getEmail());
        donor.setJob(dto.getJob());
        donor.setWeight(dto.getWeight());
        if (dto.getBloodGroup() != null) {
            String bg = dto.getBloodGroup();
            String aboType = bg.replace("+", "").replace("-", "");
            String rhFactor = bg.endsWith("+") ? "+" : "-";
            BloodGroup bloodGroup = bloodGroupRepository.findByAboTypeAndRhFactor(aboType, rhFactor)
                .orElseThrow(() -> new RuntimeException("Blood group not found: " + bg));
            donor.setBloodGroup(bloodGroup);
        }
        return donorRepository.save(donor);
    }
} 