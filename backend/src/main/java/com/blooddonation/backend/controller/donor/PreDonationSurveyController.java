package com.blooddonation.backend.controller.donor;

import com.blooddonation.backend.dto.donor.PreDonationSurveyDTO;
import com.blooddonation.backend.service.donor.PreDonationSurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/donor/survey")
@CrossOrigin
public class PreDonationSurveyController {

    @Autowired
    private PreDonationSurveyService surveyService;

    @PostMapping("/create")
    public ResponseEntity<PreDonationSurveyDTO> createSurvey(@RequestBody PreDonationSurveyDTO surveyDTO) {
        PreDonationSurveyDTO createdSurvey = surveyService.createSurvey(surveyDTO);
        return ResponseEntity.ok(createdSurvey);
    }

    @GetMapping("/latest/{donorId}")
    public ResponseEntity<PreDonationSurveyDTO> getLatestSurvey(@PathVariable Integer donorId) {
        PreDonationSurveyDTO survey = surveyService.getLatestSurvey(donorId);
        if (survey == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(survey);
    }
} 