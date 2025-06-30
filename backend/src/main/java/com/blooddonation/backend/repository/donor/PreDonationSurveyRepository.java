package com.blooddonation.backend.repository.donor;

import com.blooddonation.backend.entity.donor.PreDonationSurvey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PreDonationSurveyRepository extends JpaRepository<PreDonationSurvey, Integer> {
    Optional<PreDonationSurvey> findTopByDonorDonorIdOrderByCreatedAtDesc(Integer donorId);
} 