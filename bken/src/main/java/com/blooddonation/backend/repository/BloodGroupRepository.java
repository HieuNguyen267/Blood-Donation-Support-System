package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BloodGroupRepository extends JpaRepository<BloodGroup, Integer> {
    
    Optional<BloodGroup> findByAboTypeAndRhFactor(String aboType, String rhFactor);
    
    Optional<BloodGroup> findByAboType(String aboType);
} 