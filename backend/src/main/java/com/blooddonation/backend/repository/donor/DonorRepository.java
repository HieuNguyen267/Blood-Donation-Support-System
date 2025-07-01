package com.blooddonation.backend.repository.donor;
import com.blooddonation.backend.entity.donor.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Integer> {
    
    Optional<Donor> findByAccountAccountId(Integer accountId);
    
    Optional<Donor> findByPhone(String phone);
    
    List<Donor> findByBloodGroupBloodGroupId(Integer bloodGroupId);
    
    @Query("SELECT " +
           "CASE " +
           "  WHEN YEAR(CURRENT_DATE) - YEAR(d.dateOfBirth) < 18 THEN 'Under 18' " +
           "  WHEN YEAR(CURRENT_DATE) - YEAR(d.dateOfBirth) BETWEEN 18 AND 25 THEN '18-25' " +
           "  WHEN YEAR(CURRENT_DATE) - YEAR(d.dateOfBirth) BETWEEN 26 AND 35 THEN '26-35' " +
           "  WHEN YEAR(CURRENT_DATE) - YEAR(d.dateOfBirth) BETWEEN 36 AND 50 THEN '36-50' " +
           "  ELSE 'Over 50' " +
           "END as ageGroup, COUNT(d) " +
           "FROM Donor d GROUP BY ageGroup")
    List<Object[]> getAgeDistribution();

    @Query("SELECT d.gender, COUNT(d) FROM Donor d GROUP BY d.gender")
    List<Object[]> getGenderDistribution();

    @Query("SELECT d.bloodGroup.aboType, d.bloodGroup.rhFactor, COUNT(d) FROM Donor d GROUP BY d.bloodGroup.aboType, d.bloodGroup.rhFactor")
    List<Object[]> getBloodGroupDistribution();

    @Query("SELECT d FROM Donor d WHERE d.account.email = :email")
    Optional<Donor> findByEmail(@org.springframework.data.repository.query.Param("email") String email);

    void deleteByAccount_AccountId(Integer accountId);
} 