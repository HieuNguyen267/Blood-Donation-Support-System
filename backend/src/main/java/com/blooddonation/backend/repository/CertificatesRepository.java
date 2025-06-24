package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.Certificates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificatesRepository extends JpaRepository<Certificates, Integer> {
    
    List<Certificates> findByDonorDonorId(Integer donorId);
    
    Optional<Certificates> findByCertificateNumber(String certificateNumber);
    
    Optional<Certificates> findByVerificationCode(String verificationCode);
    
    List<Certificates> findByCertificateStatus(String status);
    
    List<Certificates> findByMilestoneType(String milestoneType);
    
    @Query("SELECT c FROM Certificates c WHERE c.donor.donorId = :donorId AND c.certificateStatus = 'active'")
    List<Certificates> findActiveCertificatesByDonor(@Param("donorId") Integer donorId);
    
    @Query("SELECT c FROM Certificates c WHERE c.issuedDate >= :startDate AND c.issuedDate <= :endDate")
    List<Certificates> findCertificatesByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT c FROM Certificates c WHERE c.issuedByStaff.staffId = :staffId")
    List<Certificates> findCertificatesByIssuer(@Param("staffId") Integer staffId);
    
    boolean existsByCertificateNumber(String certificateNumber);
    
    boolean existsByVerificationCode(String verificationCode);
} 