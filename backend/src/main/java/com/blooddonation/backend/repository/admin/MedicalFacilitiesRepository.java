package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.MedicalFacilities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalFacilitiesRepository extends JpaRepository<MedicalFacilities, Integer> {
    
    Optional<MedicalFacilities> findByLicenseNumber(String licenseNumber);
    
    List<MedicalFacilities> findByFacilityType(String facilityType);
    
    List<MedicalFacilities> findByAccountAccountId(Integer accountId);
    
    @Query("SELECT mf FROM MedicalFacilities mf WHERE mf.facilityName LIKE %:name%")
    List<MedicalFacilities> findByFacilityNameContaining(@Param("name") String name);
    
    @Query("SELECT mf FROM MedicalFacilities mf WHERE mf.email = :email")
    Optional<MedicalFacilities> findByEmail(@Param("email") String email);
    
    @Query("SELECT mf FROM MedicalFacilities mf WHERE mf.phone = :phone")
    Optional<MedicalFacilities> findByPhone(@Param("phone") String phone);
    
    boolean existsByLicenseNumber(String licenseNumber);

    // Analytics methods
    @Query("SELECT mf.facilityName, COUNT(br), AVG(br.quantityRequested), AVG(br.quantityFulfilled) " +
           "FROM MedicalFacilities mf LEFT JOIN BloodRequest br ON mf.facilityId = br.facility.facilityId " +
           "GROUP BY mf.facilityName")
    List<Object[]> getFacilityPerformanceStats();
} 