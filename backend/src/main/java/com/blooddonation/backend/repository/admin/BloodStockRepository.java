package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.BloodStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodStockRepository extends JpaRepository<BloodStock, Long> {
    
    List<BloodStock> findByBloodGroupBloodGroupId(Long bloodGroupId);
    
    @Query("SELECT bs FROM BloodStock bs WHERE bs.bloodGroup.bloodGroupId = ?1")
    List<BloodStock> findByBloodGroupId(Long bloodGroupId);
    
    @Query("SELECT SUM(bs.volume) FROM BloodStock bs WHERE bs.bloodGroup.bloodGroupId = ?1")
    Integer getTotalVolumeByBloodGroupId(Long bloodGroupId);
} 