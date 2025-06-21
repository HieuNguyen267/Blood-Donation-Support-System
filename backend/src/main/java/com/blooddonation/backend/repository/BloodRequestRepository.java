package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Integer> {
    
    List<BloodRequest> findByFacilityFacilityId(Integer facilityId);
    
    List<BloodRequest> findByBloodGroupBloodGroupId(Integer bloodGroupId);
    
    List<BloodRequest> findByRequestStatus(String status);
    
    List<BloodRequest> findByUrgencyLevel(String urgencyLevel);
    
    @Query("SELECT br FROM BloodRequest br WHERE br.requiredBy <= :deadline AND br.requestStatus = 'pending'")
    List<BloodRequest> findUrgentRequests(@Param("deadline") LocalDateTime deadline);
    
    @Query("SELECT br FROM BloodRequest br WHERE br.facility.facilityId = :facilityId AND br.requestStatus IN ('pending', 'partially_fulfilled')")
    List<BloodRequest> findActiveRequestsByFacility(@Param("facilityId") Integer facilityId);
    
    List<BloodRequest> findByRequestStatusAndUrgencyLevel(String status, String urgencyLevel);
} 