package com.blooddonation.backend.repository.common;

import com.blooddonation.backend.entity.common.MatchingBlood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchingBloodRepository extends JpaRepository<MatchingBlood, Integer> {
    List<MatchingBlood> findByRequestId(Integer requestId);
    List<MatchingBlood> findByDonorId(Integer donorId);
    List<MatchingBlood> findByFacilityId(Integer facilityId);
    // Thêm các truy vấn custom nếu cần
    @Query("SELECT m, d.fullName, d.dateOfBirth, d.phone, d.address, bg.aboType, bg.rhFactor " +
           "FROM MatchingBlood m " +
           "JOIN com.blooddonation.backend.entity.donor.Donor d ON m.donorId = d.donorId " +
           "JOIN com.blooddonation.backend.entity.admin.BloodGroup bg ON d.bloodGroup.bloodGroupId = bg.bloodGroupId " +
           "WHERE m.requestId = :requestId AND (m.status = 'contact_successful' OR m.status = 'completed')")
    List<Object[]> findAcceptedMatchingWithDonorInfoByRequestId(@Param("requestId") Integer requestId);
} 