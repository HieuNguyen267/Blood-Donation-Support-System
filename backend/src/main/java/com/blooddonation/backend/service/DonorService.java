package com.blooddonation.backend.service;

import com.blooddonation.backend.entity.Donor;
import java.util.List;

public interface DonorService {
    List<Donor> getAllDonors();
    Donor getDonorById(Integer id);
    Donor saveDonor(Donor donor);
    void deleteDonor(Integer id);
    Donor getDonorByEmail(String email);
} 