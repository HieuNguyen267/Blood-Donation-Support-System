package com.blooddonation.backend.repository.common;

import com.blooddonation.backend.entity.common.EmergencyRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmergencyRequestRepository extends JpaRepository<EmergencyRequest, Integer> {} 