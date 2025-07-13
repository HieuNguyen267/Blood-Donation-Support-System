package com.blooddonation.backend.service.donor.impl;
import com.blooddonation.backend.dto.donor.PreDonationSurveyDTO;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.donor.PreDonationSurvey;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.donor.PreDonationSurveyRepository;
import com.blooddonation.backend.service.donor.PreDonationSurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.LocalDateTime;

@Service
public class PreDonationSurveyServiceImpl implements PreDonationSurveyService {

    @Autowired
    private PreDonationSurveyRepository surveyRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Override
    @Transactional
    public PreDonationSurveyDTO createSurvey(PreDonationSurveyDTO surveyDTO) {

        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Donor donor = donorRepository.findByEmail(userEmail)
            .orElseThrow(() -> new RuntimeException("Donor not found"));

        PreDonationSurvey survey = new PreDonationSurvey();
        survey.setDonor(donor);
        survey.setHasFluFeverCough(surveyDTO.getHasFluFeverCough());
        survey.setHasSoreThroat(surveyDTO.getHasSoreThroat());
        survey.setHasDiarrheaDigestiveIssues(surveyDTO.getHasDiarrheaDigestiveIssues());
        survey.setHasHeadacheDizzinessFatigue(surveyDTO.getHasHeadacheDizzinessFatigue());
        survey.setHasAllergicReactions(surveyDTO.getHasAllergicReactions());
        survey.setHasInfectionOpenWounds(surveyDTO.getHasInfectionOpenWounds());
        survey.setUsesAntibioticsMedication(surveyDTO.getUsesAntibioticsMedication());
        survey.setHasInfectiousDiseaseHistory(surveyDTO.getHasInfectiousDiseaseHistory());
        survey.setHasHypertensionHeartDisease(surveyDTO.getHasHypertensionHeartDisease());
        survey.setHasDiabetesChronicDiseases(surveyDTO.getHasDiabetesChronicDiseases());
        survey.setAdditionalNotes(surveyDTO.getAdditionalNotes());
        survey.setCreatedAt(LocalDateTime.now());
        survey.setUpdatedAt(LocalDateTime.now());

        PreDonationSurvey savedSurvey = surveyRepository.save(survey);
        return convertToDTO(savedSurvey);
    }

    @Override
    public PreDonationSurveyDTO getLatestSurvey(Integer donorId) {
        return surveyRepository.findTopByDonorDonorIdOrderByCreatedAtDesc(donorId)
            .map(this::convertToDTO)
            .orElse(null);
    }

    @Override
    public PreDonationSurveyDTO getSurveyById(Integer surveyId) {
        return surveyRepository.findById(surveyId)
            .map(this::convertToDTO)
            .orElse(null);
    }

    @Override
    @Transactional
    public void deleteSurveysByDonorId(Integer donorId) {
        surveyRepository.deleteByDonorDonorId(donorId);
    }

    @Override
    @Transactional
    public void deleteSurveyById(Integer surveyId) {
        surveyRepository.deleteById(surveyId);
    }

    private PreDonationSurveyDTO convertToDTO(PreDonationSurvey survey) {
        PreDonationSurveyDTO dto = new PreDonationSurveyDTO();
        dto.setSurveyId(survey.getSurveyId());
        dto.setDonorId(survey.getDonor().getDonorId());
        dto.setHasFluFeverCough(survey.getHasFluFeverCough());
        dto.setHasSoreThroat(survey.getHasSoreThroat());
        dto.setHasDiarrheaDigestiveIssues(survey.getHasDiarrheaDigestiveIssues());
        dto.setHasHeadacheDizzinessFatigue(survey.getHasHeadacheDizzinessFatigue());
        dto.setHasAllergicReactions(survey.getHasAllergicReactions());
        dto.setHasInfectionOpenWounds(survey.getHasInfectionOpenWounds());
        dto.setUsesAntibioticsMedication(survey.getUsesAntibioticsMedication());
        dto.setHasInfectiousDiseaseHistory(survey.getHasInfectiousDiseaseHistory());
        dto.setHasHypertensionHeartDisease(survey.getHasHypertensionHeartDisease());
        dto.setHasDiabetesChronicDiseases(survey.getHasDiabetesChronicDiseases());
        dto.setAdditionalNotes(survey.getAdditionalNotes());
        return dto;
    }
} 