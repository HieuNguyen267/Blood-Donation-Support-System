package com.blooddonation.backend.dto.donor;
import com.blooddonation.backend.entity.donor.PreDonationSurvey.*;
import lombok.Data;

@Data
public class PreDonationSurveyDTO {
    private Integer surveyId;
    private Integer donorId;
    private FluFeverCoughStatus hasFluFeverCough;
    private SoreThroatStatus hasSoreThroat;
    private DigestiveIssuesStatus hasDiarrheaDigestiveIssues;
    private HeadacheDizzinessStatus hasHeadacheDizzinessFatigue;
    private AllergicReactionsStatus hasAllergicReactions;
    private InfectionWoundsStatus hasInfectionOpenWounds;
    private AntibioticsMedicationStatus usesAntibioticsMedication;
    private InfectiousDiseaseStatus hasInfectiousDiseaseHistory;
    private HypertensionHeartStatus hasHypertensionHeartDisease;
    private DiabetesChronicStatus hasDiabetesChronicDiseases;
    private String additionalNotes;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
} 