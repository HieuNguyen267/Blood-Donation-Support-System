package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.service.admin.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        return ResponseEntity.ok(analyticsService.getDashboardData());
    }

    @GetMapping("/blood-stock-summary")
    public ResponseEntity<Map<String, Object>> getBloodStockSummary() {
        return ResponseEntity.ok(analyticsService.getBloodStockSummary());
    }

    @GetMapping("/donation-statistics")
    public ResponseEntity<Map<String, Object>> getDonationStatistics(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return ResponseEntity.ok(analyticsService.getDonationStatistics(startDate, endDate));
    }

    @GetMapping("/request-statistics")
    public ResponseEntity<Map<String, Object>> getRequestStatistics(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return ResponseEntity.ok(analyticsService.getRequestStatistics(startDate, endDate));
    }

    @GetMapping("/facility-performance")
    public ResponseEntity<Map<String, Object>> getFacilityPerformance() {
        return ResponseEntity.ok(analyticsService.getFacilityPerformance());
    }

    @GetMapping("/donor-demographics")
    public ResponseEntity<Map<String, Object>> getDonorDemographics() {
        return ResponseEntity.ok(analyticsService.getDonorDemographics());
    }

    @GetMapping("/emergency-alerts")
    public ResponseEntity<Map<String, Object>> getEmergencyAlerts() {
        return ResponseEntity.ok(analyticsService.getEmergencyAlerts());
    }

    @GetMapping("/expiring-stock-report")
    public ResponseEntity<Map<String, Object>> getExpiringStockReport() {
        return ResponseEntity.ok(analyticsService.getExpiringStockReport());
    }
} 