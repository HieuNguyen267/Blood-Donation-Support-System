package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
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

    // Analytics methods
    long countByUrgencyLevel(String urgencyLevel);

    @Query("SELECT DATE(br.createdAt), COUNT(br) FROM BloodRequest br WHERE br.createdAt >= :startDate AND br.createdAt <= :endDate GROUP BY DATE(br.createdAt)")
    List<Object[]> getRequestsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT br.urgencyLevel, COUNT(br) FROM BloodRequest br GROUP BY br.urgencyLevel")
    List<Object[]> getRequestsByUrgencyLevel();

    @Query("SELECT br.facility.facilityName, COUNT(br) FROM BloodRequest br GROUP BY br.facility.facilityName")
    List<Object[]> getRequestsByFacility();

    @Query("SELECT br.facility.facilityName, br.urgencyLevel, COUNT(br) FROM BloodRequest br WHERE br.requiredBy <= :deadline GROUP BY br.facility.facilityName, br.urgencyLevel")
    List<Object[]> getUrgentRequests(@Param("deadline") LocalDateTime deadline);

    @Query("SELECT br.facility.facilityName, AVG(br.quantityFulfilled * 100.0 / br.quantityRequested) FROM BloodRequest br WHERE br.requestStatus = 'completed' GROUP BY br.facility.facilityName")
    List<Object[]> getFulfillmentRatesByFacility();
} 