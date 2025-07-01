package com.blooddonation.backend.service.donor;

import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.dto.donor.DonorDTO;
import java.util.List;

public interface DonorService {
    List<Donor> getAllDonors();
    Donor getDonorById(Integer id);
    Donor saveDonor(Donor donor);
    void deleteDonor(Integer id);
    Donor getDonorByEmail(String email);
    Donor updateDonor(Integer id, DonorDTO donorDTO);
} 