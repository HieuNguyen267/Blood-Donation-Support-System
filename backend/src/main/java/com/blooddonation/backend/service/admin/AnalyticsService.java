package com.blooddonation.backend.service.admin;

import java.time.LocalDate;
import java.util.Map;

public interface AnalyticsService {
    Map<String, Object> getDashboardData();
    Map<String, Object> getBloodStockSummary();
    Map<String, Object> getDonationStatistics(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getRequestStatistics(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getFacilityPerformance();
    Map<String, Object> getDonorDemographics();
    Map<String, Object> getEmergencyAlerts();
    Map<String, Object> getExpiringStockReport();
} 