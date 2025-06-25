package com.blooddonation.backend.service.impl;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.common.EventRepository;
import com.blooddonation.backend.repository.admin.BloodRequestRepository;
import com.blooddonation.backend.repository.admin.BloodStockRepository;
import com.blooddonation.backend.repository.admin.DonationRegisterRepository;
import com.blooddonation.backend.repository.admin.MedicalFacilitiesRepository;
import com.blooddonation.backend.service.admin.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private DonationRegisterRepository donationRegisterRepository;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private BloodStockRepository bloodStockRepository;

    @Autowired
    private MedicalFacilitiesRepository medicalFacilitiesRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        
        // Tổng số người hiến máu
        long totalDonors = donorRepository.count();
        dashboard.put("totalDonors", totalDonors);
        
        // Tổng số đăng ký hiến máu
        long totalRegistrations = donationRegisterRepository.count();
        dashboard.put("totalRegistrations", totalRegistrations);
        
        // Tổng số yêu cầu máu
        long totalRequests = bloodRequestRepository.count();
        dashboard.put("totalRequests", totalRequests);
        
        // Tổng số cơ sở y tế
        long totalFacilities = medicalFacilitiesRepository.count();
        dashboard.put("totalFacilities", totalFacilities);
        
        // Số lượng máu có sẵn
        List<Object[]> availableStock = bloodStockRepository.getAvailableStockSummary();
        dashboard.put("availableStock", availableStock);
        
        // Yêu cầu khẩn cấp
        long urgentRequests = bloodRequestRepository.countByUrgencyLevel("urgent");
        dashboard.put("urgentRequests", urgentRequests);
        
        // Sự kiện sắp tới
        long upcomingEvents = eventRepository.countByStartDateAfter(LocalDate.now());
        dashboard.put("upcomingEvents", upcomingEvents);
        
        return dashboard;
    }

    @Override
    public Map<String, Object> getBloodStockSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Tổng số lượng máu theo nhóm máu
        List<Object[]> stockByBloodGroup = bloodStockRepository.getStockSummaryByBloodGroup();
        summary.put("stockByBloodGroup", stockByBloodGroup);
        
        // Máu sắp hết hạn
        List<Object[]> expiringStock = bloodStockRepository.getExpiringStockSummary(LocalDate.now().plusDays(7));
        summary.put("expiringStock", expiringStock);
        
        // Trạng thái kho máu
        List<Object[]> stockByStatus = bloodStockRepository.getStockSummaryByStatus();
        summary.put("stockByStatus", stockByStatus);
        
        return summary;
    }

    @Override
    public Map<String, Object> getDonationStatistics(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> statistics = new HashMap<>();
        
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now();
        
        // Thống kê đăng ký theo ngày
        List<Object[]> registrationsByDate = donationRegisterRepository.getRegistrationsByDateRange(startDate, endDate);
        statistics.put("registrationsByDate", registrationsByDate);
        
        // Thống kê theo trạng thái
        List<Object[]> registrationsByStatus = donationRegisterRepository.getRegistrationsByStatus();
        statistics.put("registrationsByStatus", registrationsByStatus);
        
        // Thống kê theo sự kiện
        List<Object[]> registrationsByEvent = donationRegisterRepository.getRegistrationsByEvent();
        statistics.put("registrationsByEvent", registrationsByEvent);
        
        return statistics;
    }

    @Override
    public Map<String, Object> getRequestStatistics(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> statistics = new HashMap<>();
        
        if (startDate == null) startDate = LocalDate.now().minusMonths(1);
        if (endDate == null) endDate = LocalDate.now();
        
        // Thống kê yêu cầu theo ngày
        List<Object[]> requestsByDate = bloodRequestRepository.getRequestsByDateRange(startDate, endDate);
        statistics.put("requestsByDate", requestsByDate);
        
        // Thống kê theo mức độ khẩn cấp
        List<Object[]> requestsByUrgency = bloodRequestRepository.getRequestsByUrgencyLevel();
        statistics.put("requestsByUrgency", requestsByUrgency);
        
        // Thống kê theo cơ sở y tế
        List<Object[]> requestsByFacility = bloodRequestRepository.getRequestsByFacility();
        statistics.put("requestsByFacility", requestsByFacility);
        
        return statistics;
    }

    @Override
    public Map<String, Object> getFacilityPerformance() {
        Map<String, Object> performance = new HashMap<>();
        
        // Hiệu suất theo cơ sở y tế
        List<Object[]> facilityStats = medicalFacilitiesRepository.getFacilityPerformanceStats();
        performance.put("facilityStats", facilityStats);
        
        // Tỷ lệ đáp ứng yêu cầu
        List<Object[]> fulfillmentRates = bloodRequestRepository.getFulfillmentRatesByFacility();
        performance.put("fulfillmentRates", fulfillmentRates);
        
        return performance;
    }

    @Override
    public Map<String, Object> getDonorDemographics() {
        Map<String, Object> demographics = new HashMap<>();
        
        // Phân bố theo độ tuổi
        List<Object[]> ageDistribution = donorRepository.getAgeDistribution();
        demographics.put("ageDistribution", ageDistribution);
        
        // Phân bố theo giới tính
        List<Object[]> genderDistribution = donorRepository.getGenderDistribution();
        demographics.put("genderDistribution", genderDistribution);
        
        // Phân bố theo nhóm máu
        List<Object[]> bloodGroupDistribution = donorRepository.getBloodGroupDistribution();
        demographics.put("bloodGroupDistribution", bloodGroupDistribution);
        
        return demographics;
    }

    @Override
    public Map<String, Object> getEmergencyAlerts() {
        Map<String, Object> alerts = new HashMap<>();
        
        // Yêu cầu khẩn cấp
        List<Object[]> urgentRequests = bloodRequestRepository.getUrgentRequests(LocalDateTime.now().plusHours(24));
        alerts.put("urgentRequests", urgentRequests);
        
        // Máu sắp hết hạn
        List<Object[]> expiringAlerts = bloodStockRepository.getExpiringAlerts(LocalDate.now().plusDays(7));
        alerts.put("expiringAlerts", expiringAlerts);
        
        // Kho máu thấp
        List<Object[]> lowStockAlerts = bloodStockRepository.getLowStockAlerts();
        alerts.put("lowStockAlerts", lowStockAlerts);
        
        return alerts;
    }

    @Override
    public Map<String, Object> getExpiringStockReport() {
        Map<String, Object> report = new HashMap<>();
        
        // Máu hết hạn trong 7 ngày tới
        List<Object[]> expiringIn7Days = bloodStockRepository.getExpiringInDays(7);
        report.put("expiringIn7Days", expiringIn7Days);
        
        // Máu hết hạn trong 30 ngày tới
        List<Object[]> expiringIn30Days = bloodStockRepository.getExpiringInDays(30);
        report.put("expiringIn30Days", expiringIn30Days);
        
        return report;
    }
} 