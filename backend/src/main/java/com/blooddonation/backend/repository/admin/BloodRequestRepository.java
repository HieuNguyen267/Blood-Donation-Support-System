package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Integer> {
} 