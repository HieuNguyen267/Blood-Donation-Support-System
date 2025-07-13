package com.blooddonation.backend.repository.common;

import com.blooddonation.backend.entity.common.MatchingBlood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchingBloodRepository extends JpaRepository<MatchingBlood, Integer> {
    List<MatchingBlood> findByRequestId(Integer requestId);
    List<MatchingBlood> findByDonorId(Integer donorId);
    List<MatchingBlood> findByFacilityId(Integer facilityId);
    // Thêm các truy vấn custom nếu cần
} 