package com.blooddonation.backend.service;

import com.blooddonation.backend.entity.Donor;
import com.blooddonation.backend.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonorService {
    private final DonorRepository donorRepository;

    public DonorService(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    public Donor getDonorById(Integer id) {
        return donorRepository.findById(id).orElse(null);
    }

    public Donor saveDonor(Donor donor) {
        return donorRepository.save(donor);
    }

    public void deleteDonor(Integer id) {
        donorRepository.deleteById(id);
    }
} 