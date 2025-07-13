package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.MedicalFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalFacilityRepository extends JpaRepository<MedicalFacility, Long> {
    boolean existsByLicenseNumber(String licenseNumber);
    MedicalFacility findByAccountId(Integer accountId);
} 