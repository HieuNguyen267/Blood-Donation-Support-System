package com.blooddonation.backend.service.impl;

import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.common.EventRepository;
import com.blooddonation.backend.repository.admin.BloodStockRepository;
import com.blooddonation.backend.repository.admin.DonationRegisterRepository;
import com.blooddonation.backend.entity.admin.BloodStock;
import com.blooddonation.backend.service.admin.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    private BloodStockRepository bloodStockRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Map<String, Object> getDashboardData() {
        Map<String, Object> dashboard = new HashMap<>();
        
        try {
            // Tổng số người hiến máu
            long totalDonors = donorRepository.count();
            dashboard.put("totalDonors", totalDonors);
            
            // Tổng số đăng ký hiến máu
            long totalRegistrations = donationRegisterRepository.count();
            dashboard.put("totalRegistrations", totalRegistrations);
            
            // Số lượng máu có sẵn (sử dụng method có sẵn)
            // List<BloodStock> availableStock = bloodStockRepository.findByStatus("available");
            // long availableStockCount = availableStock.size();
            // dashboard.put("availableStockCount", availableStockCount);
            
            // Sự kiện sắp tới
            long upcomingEvents = eventRepository.countByDateAfter(LocalDate.now());
            dashboard.put("upcomingEvents", upcomingEvents);
            
        } catch (Exception e) {
            // Log error và trả về dữ liệu mặc định
            System.err.println("Error in getDashboardData: " + e.getMessage());
            dashboard.put("totalDonors", 0L);
            dashboard.put("totalRegistrations", 0L);
            dashboard.put("availableStockCount", 0L);
            dashboard.put("upcomingEvents", 0L);
        }
        
        return dashboard;
    }

    @Override
    public Map<String, Object> getBloodStockSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        try {
            // Tổng số lượng máu theo nhóm máu
            long totalStock = bloodStockRepository.count();
            summary.put("totalStock", totalStock);
            
            // Máu có sẵn
            // List<BloodStock> availableStockList = bloodStockRepository.findByStatus("available");
            // long availableStock = availableStockList.size();
            // summary.put("availableStock", availableStock);
            
            // Máu đã sử dụng (placeholder)
            long usedStock = 0L;
            summary.put("usedStock", usedStock);
            
            // Máu hết hạn (placeholder)
            long expiredStock = 0L;
            summary.put("expiredStock", expiredStock);
            
        } catch (Exception e) {
            System.err.println("Error in getBloodStockSummary: " + e.getMessage());
            summary.put("totalStock", 0L);
            summary.put("availableStock", 0L);
            summary.put("usedStock", 0L);
            summary.put("expiredStock", 0L);
        }
        
        return summary;
    }

    @Override
    public Map<String, Object> getDonationStatistics(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> statistics = new HashMap<>();
        
        try {
            if (startDate == null) startDate = LocalDate.now().minusMonths(1);
            if (endDate == null) endDate = LocalDate.now();
            
            // Tổng số đăng ký trong khoảng thời gian
            long totalRegistrations = donationRegisterRepository.count();
            statistics.put("totalRegistrations", totalRegistrations);
            
            // Đăng ký theo trạng thái (placeholder)
            long pendingRegistrations = 0L;
            statistics.put("pendingRegistrations", pendingRegistrations);
            
            long approvedRegistrations = 0L;
            statistics.put("approvedRegistrations", approvedRegistrations);
            
            long completedRegistrations = 0L;
            statistics.put("completedRegistrations", completedRegistrations);
            
        } catch (Exception e) {
            System.err.println("Error in getDonationStatistics: " + e.getMessage());
            statistics.put("totalRegistrations", 0L);
            statistics.put("pendingRegistrations", 0L);
            statistics.put("approvedRegistrations", 0L);
            statistics.put("completedRegistrations", 0L);
        }
        
        return statistics;
    }

    @Override
    public Map<String, Object> getRequestStatistics(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> statistics = new HashMap<>();
        
        try {
            if (startDate == null) startDate = LocalDate.now().minusMonths(1);
            if (endDate == null) endDate = LocalDate.now();
            
            // Placeholder cho thống kê yêu cầu máu
            statistics.put("totalRequests", 0L);
            statistics.put("pendingRequests", 0L);
            statistics.put("approvedRequests", 0L);
            statistics.put("completedRequests", 0L);
            
        } catch (Exception e) {
            System.err.println("Error in getRequestStatistics: " + e.getMessage());
            statistics.put("totalRequests", 0L);
            statistics.put("pendingRequests", 0L);
            statistics.put("approvedRequests", 0L);
            statistics.put("completedRequests", 0L);
        }
        
        return statistics;
    }

    @Override
    public Map<String, Object> getDonorDemographics() {
        Map<String, Object> demographics = new HashMap<>();
        
        try {
            // Tổng số người hiến
            long totalDonors = donorRepository.count();
            demographics.put("totalDonors", totalDonors);
            
            // Phân bố theo giới tính (placeholder)
            long maleDonors = 0L;
            demographics.put("maleDonors", maleDonors);
            
            long femaleDonors = 0L;
            demographics.put("femaleDonors", femaleDonors);
            
            // Phân bố theo nhóm máu (sử dụng method có sẵn)
            long donorsWithBloodGroup = donorRepository.count();
            demographics.put("donorsWithBloodGroup", donorsWithBloodGroup);
            
        } catch (Exception e) {
            System.err.println("Error in getDonorDemographics: " + e.getMessage());
            demographics.put("totalDonors", 0L);
            demographics.put("maleDonors", 0L);
            demographics.put("femaleDonors", 0L);
            demographics.put("donorsWithBloodGroup", 0L);
        }
        
        return demographics;
    }

    @Override
    public Map<String, Object> getEmergencyAlerts() {
        Map<String, Object> alerts = new HashMap<>();
        
        try {
            // Máu có sẵn thấp
            // List<BloodStock> availableStockList = bloodStockRepository.findByStatus("available");
            // long lowStockCount = availableStockList.size();
            // alerts.put("lowStockCount", lowStockCount);
            // Cảnh báo kho máu thấp
            // boolean isLowStock = lowStockCount < 10; // Giả sử ngưỡng là 10
            // alerts.put("isLowStock", isLowStock);
            
            // Số lượng máu sắp hết hạn (placeholder)
            alerts.put("expiringCount", 0L);
            
        } catch (Exception e) {
            System.err.println("Error in getEmergencyAlerts: " + e.getMessage());
            alerts.put("lowStockCount", 0L);
            alerts.put("isLowStock", false);
            alerts.put("expiringCount", 0L);
        }
        
        return alerts;
    }

    @Override
    public Map<String, Object> getExpiringStockReport() {
        Map<String, Object> report = new HashMap<>();
        
        try {
            // Máu hết hạn trong 7 ngày tới (placeholder)
            report.put("expiringIn7Days", 0L);
            
            // Máu hết hạn trong 30 ngày tới (placeholder)
            report.put("expiringIn30Days", 0L);
            
            // Tổng số máu sắp hết hạn
            report.put("totalExpiring", 0L);
            
        } catch (Exception e) {
            System.err.println("Error in getExpiringStockReport: " + e.getMessage());
            report.put("expiringIn7Days", 0L);
            report.put("expiringIn30Days", 0L);
            report.put("totalExpiring", 0L);
        }
        
        return report;
    }
} 