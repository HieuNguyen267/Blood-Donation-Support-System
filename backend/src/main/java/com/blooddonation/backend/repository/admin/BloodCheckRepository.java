package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.BloodCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodCheckRepository extends JpaRepository<BloodCheck, Integer> {
    
    List<BloodCheck> findByRegisterRegisterId(Integer registerId);
    
    List<BloodCheck> findByDonorDonorId(Integer donorId);
    
    List<BloodCheck> findByStaffStaffId(Integer staffId);
    
    List<BloodCheck> findByStatus(String status);
} 