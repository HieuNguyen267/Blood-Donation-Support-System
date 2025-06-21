package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.BloodStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloodStockRepository extends JpaRepository<BloodStock, Integer> {
    
    List<BloodStock> findByBloodGroupBloodGroupId(Integer bloodGroupId);
    
    List<BloodStock> findByStatus(String status);
    
    List<BloodStock> findByBloodGroupBloodGroupIdAndStatus(Integer bloodGroupId, String status);
    
    @Query("SELECT bs FROM BloodStock bs WHERE bs.expiryDate <= :expiryDate AND bs.status = 'available'")
    List<BloodStock> findExpiringStock(@Param("expiryDate") LocalDate expiryDate);
    
    @Query("SELECT bs FROM BloodStock bs WHERE bs.collectionDate >= :startDate AND bs.collectionDate <= :endDate")
    List<BloodStock> findStockByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT bs FROM BloodStock bs WHERE bs.qualityCheckPassed = true AND bs.status = 'available'")
    List<BloodStock> findAvailableQualityStock();
    
    List<BloodStock> findByEventEventId(Integer eventId);
    
    @Query("SELECT SUM(bs.volume) FROM BloodStock bs WHERE bs.bloodGroup.bloodGroupId = :bloodGroupId AND bs.status = 'available'")
    Integer getTotalAvailableVolumeByBloodGroup(@Param("bloodGroupId") Integer bloodGroupId);
} 