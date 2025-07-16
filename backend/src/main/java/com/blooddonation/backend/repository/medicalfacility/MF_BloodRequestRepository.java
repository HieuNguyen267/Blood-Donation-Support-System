package com.blooddonation.backend.repository.medicalfacility;

import com.blooddonation.backend.entity.medicalfacility.MF_BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MF_BloodRequestRepository extends JpaRepository<MF_BloodRequest, Long> {
    // Có thể bổ sung các phương thức custom nếu cần
    java.util.Optional<MF_BloodRequest> findByRequestId(Integer requestId);
} 