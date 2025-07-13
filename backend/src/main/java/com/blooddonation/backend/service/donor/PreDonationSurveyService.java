package com.blooddonation.backend.service.donor;
import com.blooddonation.backend.dto.donor.PreDonationSurveyDTO;

public interface PreDonationSurveyService {
    PreDonationSurveyDTO createSurvey(PreDonationSurveyDTO surveyDTO);
    PreDonationSurveyDTO getLatestSurvey(Integer donorId);
    PreDonationSurveyDTO getSurveyById(Integer surveyId);
    void deleteSurveysByDonorId(Integer donorId);
    void deleteSurveyById(Integer surveyId);
} 