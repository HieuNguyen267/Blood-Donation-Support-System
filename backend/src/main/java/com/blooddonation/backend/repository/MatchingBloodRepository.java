package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.MatchingBlood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchingBloodRepository extends JpaRepository<MatchingBlood, Integer> {
    
    List<MatchingBlood> findByBloodRequestRequestId(Integer requestId);
    
    List<MatchingBlood> findByDonorDonorId(Integer donorId);
    
    List<MatchingBlood> findByDonorResponse(String response);
    
    @Query("SELECT mb FROM MatchingBlood mb WHERE mb.bloodRequest.requestId = :requestId AND mb.donorResponse = 'accepted'")
    List<MatchingBlood> findAcceptedMatchesByRequest(@Param("requestId") Integer requestId);
    
    @Query("SELECT mb FROM MatchingBlood mb WHERE mb.donor.donorId = :donorId AND mb.donationCompleted = true")
    List<MatchingBlood> findCompletedDonationsByDonor(@Param("donorId") Integer donorId);
    
    @Query("SELECT mb FROM MatchingBlood mb WHERE mb.bloodRequest.requestId = :requestId AND mb.facilityConfirmation = true")
    List<MatchingBlood> findConfirmedMatchesByRequest(@Param("requestId") Integer requestId);
    
    List<MatchingBlood> findByDonorResponseAndDonationCompleted(String response, Boolean completed);
} 