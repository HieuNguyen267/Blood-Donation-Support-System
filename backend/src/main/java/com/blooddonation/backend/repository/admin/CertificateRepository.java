package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
    
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    List<Certificate> findByDonorDonorId(Integer donorId);
    
    List<Certificate> findByRegisterRegisterId(Integer registerId);
    
    List<Certificate> findByMatchingMatchingId(Integer matchingId);
    
    @Query("SELECT c FROM Certificate c WHERE c.certificateNumber LIKE %:searchTerm% OR c.donor.fullName LIKE %:searchTerm%")
    List<Certificate> searchByCertificateNumberOrDonorName(String searchTerm);
    
    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.issuedDate = CURRENT_DATE")
    Long countCertificatesIssuedToday();
} 