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
        return donorRepository.findByEmail(email).orElse(null);
    }

    public Donor saveOrUpdateDonorFromDTO(DonorDTO dto, Donor donor) {
        if (dto.getFullName() != null) donor.setFullName(dto.getFullName());
        if (dto.getDateOfBirth() != null) donor.setDateOfBirth(LocalDate.parse(dto.getDateOfBirth()));
        if (dto.getGender() != null) donor.setGender(dto.getGender());
        if (dto.getAddress() != null) donor.setAddress(dto.getAddress());
        if (dto.getPhone() != null) donor.setPhone(dto.getPhone());
        if (dto.getEmail() != null) donor.setEmail(dto.getEmail());
        if (dto.getJob() != null) donor.setJob(dto.getJob());
        if (dto.getWeight() != null) donor.setWeight(dto.getWeight());
        if (dto.getBloodGroup() != null) {
            String bg = dto.getBloodGroup();
            String aboType = bg.replace("+", "").replace("-", "");
            String rhFactor = bg.endsWith("+") ? "+" : "-";
            BloodGroup bloodGroup = bloodGroupRepository.findByAboTypeAndRhFactor(aboType, rhFactor)
                .orElseThrow(() -> new RuntimeException("Blood group not found: " + bg));
            donor.setBloodGroup(bloodGroup);
        }
        System.out.println("[DEBUG] Before save: " + donor);
        Donor saved = donorRepository.save(donor);
        System.out.println("[DEBUG] After save: " + saved);
        return saved;
    }

    @Override
    public Donor updateDonor(Integer id, DonorDTO donorDTO) {
        Donor donor = donorRepository.findById(id).orElseThrow(() -> new RuntimeException("Donor not found"));
        return saveOrUpdateDonorFromDTO(donorDTO, donor);
    }
} 