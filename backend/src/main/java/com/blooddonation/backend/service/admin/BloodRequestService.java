package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.BloodRequestDTO;
import com.blooddonation.backend.entity.admin.BloodRequest;
import com.blooddonation.backend.entity.admin.BloodRequestStock;
import com.blooddonation.backend.repository.admin.BloodRequestRepository;
import com.blooddonation.backend.repository.admin.BloodRequestStockRepository;
import com.blooddonation.backend.repository.admin.BloodStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import com.blooddonation.backend.entity.admin.BloodStock;
import com.blooddonation.backend.entity.admin.Staff;
import com.blooddonation.backend.repository.admin.StaffRepository;
import java.time.LocalDateTime;

@Service
public class BloodRequestService {
    @Autowired
    private BloodRequestRepository bloodRequestRepository;
    @Autowired
    private BloodRequestStockRepository bloodRequestStockRepository;
    @Autowired
    private BloodStockRepository bloodStockRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private com.blooddonation.backend.repository.admin.MedicalFacilityRepository medicalFacilityRepository;
    @Autowired
    private com.blooddonation.backend.repository.admin.BloodGroupRepository bloodGroupRepository;

    public List<BloodRequestDTO> getAllRequests() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return bloodRequestRepository.findAll().stream().map(req -> {
            String bloodGroup = req.getBloodGroup().getAboType();
            String rh = req.getBloodGroup().getRhFactor();
            if (rh != null) {
                if (rh.equalsIgnoreCase("positive")) bloodGroup += "+";
                else if (rh.equalsIgnoreCase("negative")) bloodGroup += "-";
                else bloodGroup += "";
            }
            String emergencyLevel = req.getIsEmergency() != null && req.getIsEmergency() ? "Khẩn cấp" : "Bình thường";
            String requestStatus = "Chờ xác nhận";
            if (req.getRequestStatus() != null) {
                switch (req.getRequestStatus()) {
                    case "pending": requestStatus = "Chờ xác nhận"; break;
                    case "confirmed": requestStatus = "Xác nhận"; break;
                    case "rejected": requestStatus = "Từ chối"; break;
                    default: requestStatus = req.getRequestStatus();
                }
            }
            String processingStatusVN = "";
            if (req.getProcessingStatus() != null) {
                switch (req.getProcessingStatus()) {
                    case "pending": processingStatusVN = "Chờ xử lí"; break;
                    case "in transit": processingStatusVN = "Đang vận chuyển"; break;
                    case "completed": processingStatusVN = "Hoàn thành"; break;
                    default: processingStatusVN = req.getProcessingStatus();
                }
            }
            return new BloodRequestDTO(
                req.getRequestId(),
                req.getFacility() != null ? req.getFacility().getFacilityName() : "",
                req.getFacility() != null ? req.getFacility().getAddress() : "",
                bloodGroup,
                req.getQuantityRequested(),
                emergencyLevel,
                req.getRequiredBy() != null ? req.getRequiredBy().format(formatter) : "",
                req.getContactPerson(),
                req.getContactPhone(),
                req.getStaff() != null ? req.getStaff().getFullName() : "",
                req.getDeliveryPerson(),
                req.getSpecialRequirements(),
                requestStatus,
                req.getIsEmergency(),
                req.getPatientInfo(),
                req.getIsCompatible(),
                processingStatusVN,
                req.getNotes(),
                req.getBloodFullfilled(),
                req.getEmergencyStatus()
            );
        }).collect(Collectors.toList());
    }

    public BloodRequestDTO getRequestById(Integer id) {
        BloodRequest req = bloodRequestRepository.findById(id).orElse(null);
        if (req == null) return null;
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String bloodGroup = req.getBloodGroup().getAboType();
        String rh = req.getBloodGroup().getRhFactor();
        if (rh != null) {
            if (rh.equalsIgnoreCase("positive")) bloodGroup += "+";
            else if (rh.equalsIgnoreCase("negative")) bloodGroup += "-";
            else bloodGroup += "";
        }
        String emergencyLevel = req.getIsEmergency() != null && req.getIsEmergency() ? "Khẩn cấp" : "Bình thường";
        String requestStatus = "Chờ xác nhận";
        if (req.getRequestStatus() != null) {
            switch (req.getRequestStatus()) {
                case "pending": requestStatus = "Chờ xác nhận"; break;
                case "confirmed": requestStatus = "Xác nhận"; break;
                case "rejected": requestStatus = "Từ chối"; break;
                default: requestStatus = req.getRequestStatus();
            }
        }
        String processingStatusVN = "";
        if (req.getProcessingStatus() != null) {
            switch (req.getProcessingStatus()) {
                case "pending": processingStatusVN = "Chờ xử lí"; break;
                case "in transit": processingStatusVN = "Đang vận chuyển"; break;
                case "completed": processingStatusVN = "Hoàn thành"; break;
                default: processingStatusVN = req.getProcessingStatus();
            }
        }
        return new BloodRequestDTO(
            req.getRequestId(),
            req.getFacility() != null ? req.getFacility().getFacilityName() : "",
            req.getFacility() != null ? req.getFacility().getAddress() : "",
            bloodGroup,
            req.getQuantityRequested(),
            emergencyLevel,
            req.getRequiredBy() != null ? req.getRequiredBy().format(formatter) : "",
            req.getContactPerson(),
            req.getContactPhone(),
            req.getStaff() != null ? req.getStaff().getFullName() : "",
            req.getDeliveryPerson(),
            req.getSpecialRequirements(),
            requestStatus,
            req.getIsEmergency(),
            req.getPatientInfo(),
            req.getIsCompatible(),
            processingStatusVN,
            req.getNotes(),
            req.getBloodFullfilled(),
            req.getEmergencyStatus()
        );
    }

    public void createTestData() {
        // Kiểm tra xem đã có dữ liệu chưa
        if (bloodRequestRepository.count() > 0) {
            return; // Đã có dữ liệu rồi
        }

        // Tạo dữ liệu test
        // Lấy các facility, staff, blood group có sẵn
        List<com.blooddonation.backend.entity.admin.MedicalFacility> facilities = 
            medicalFacilityRepository.findAll();
        
        List<Staff> staffs = staffRepository.findAll();
        List<com.blooddonation.backend.entity.admin.BloodGroup> bloodGroups = 
            bloodGroupRepository.findAll();

        if (facilities.isEmpty() || staffs.isEmpty() || bloodGroups.isEmpty()) {
            throw new RuntimeException("Missing required data: facilities, staffs, or blood groups");
        }

        // Tạo 5 blood requests test
        for (int i = 1; i <= 5; i++) {
            BloodRequest request = new BloodRequest();
            request.setFacility(facilities.get(0)); // Sử dụng facility đầu tiên
            request.setStaff(staffs.get(0)); // Sử dụng staff đầu tiên
            request.setBloodGroup(bloodGroups.get(i % bloodGroups.size())); // Luân phiên blood groups
            request.setQuantityRequested(200 + i * 100);
            request.setIsEmergency(i % 2 == 0); // Một nửa là khẩn cấp
            request.setPatientInfo("Bệnh nhân test " + i + ", " + (20 + i * 10) + " tuổi");
            request.setRequiredBy(LocalDateTime.now().plusDays(i));
            request.setRequestStatus("pending");
            request.setContactPerson("Bác sĩ Test " + i);
            request.setContactPhone("090" + String.format("%08d", i));
            request.setSpecialRequirements("Yêu cầu đặc biệt " + i);
            request.setNotes("Ghi chú test " + i);
            
            bloodRequestRepository.save(request);
        }
    }

    public BloodRequestDTO updateRequestStatus(Integer id, String status) {
        BloodRequest req = bloodRequestRepository.findById(id).orElse(null);
        if (req == null) return null;
        // Map status tiếng Việt sang giá trị DB
        String dbStatus = "pending";
        if ("Xác nhận".equalsIgnoreCase(status) || "confirmed".equalsIgnoreCase(status)) dbStatus = "confirmed";
        else if ("Từ chối".equalsIgnoreCase(status) || "rejected".equalsIgnoreCase(status)) dbStatus = "rejected";
        req.setRequestStatus(dbStatus);
        // Nếu xác nhận thì set processing_status = 'pending'
        if ("confirmed".equals(dbStatus)) {
            req.setProcessingStatus("pending");
        }
        bloodRequestRepository.save(req);
        // Tạo lại DTO như trong getAllRequests
        String bloodGroup = req.getBloodGroup().getAboType();
        String rh = req.getBloodGroup().getRhFactor();
        if (rh != null) {
            if (rh.equalsIgnoreCase("positive")) bloodGroup += "+";
            else if (rh.equalsIgnoreCase("negative")) bloodGroup += "-";
        }
        String emergencyLevel = req.getIsEmergency() != null && req.getIsEmergency() ? "Khẩn cấp" : "Bình thường";
        String requestStatus = "Chờ xác nhận";
        if (req.getRequestStatus() != null) {
            switch (req.getRequestStatus()) {
                case "pending": requestStatus = "Chờ xác nhận"; break;
                case "confirmed": requestStatus = "Xác nhận"; break;
                case "rejected": requestStatus = "Từ chối"; break;
                default: requestStatus = req.getRequestStatus();
            }
        }
        String processingStatusVN = "";
        if (req.getProcessingStatus() != null) {
            switch (req.getProcessingStatus()) {
                case "pending": processingStatusVN = "Chờ xử lí"; break;
                case "in transit": processingStatusVN = "Đang vận chuyển"; break;
                case "completed": processingStatusVN = "Hoàn thành"; break;
                default: processingStatusVN = req.getProcessingStatus();
            }
        }
        return new BloodRequestDTO(
            req.getRequestId(),
            req.getFacility() != null ? req.getFacility().getFacilityName() : "",
            req.getFacility() != null ? req.getFacility().getAddress() : "",
            bloodGroup,
            req.getQuantityRequested(),
            emergencyLevel,
            req.getRequiredBy() != null ? req.getRequiredBy().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "",
            req.getContactPerson(),
            req.getContactPhone(),
            req.getStaff() != null ? req.getStaff().getFullName() : "",
            req.getDeliveryPerson(),
            req.getSpecialRequirements(),
            requestStatus,
            req.getIsEmergency(),
            req.getPatientInfo(),
            req.getIsCompatible(),
            processingStatusVN,
            req.getNotes(),
            req.getBloodFullfilled(),
            req.getEmergencyStatus()
        );
    }

    public BloodRequestDTO sendBlood(Integer id, List<com.blooddonation.backend.controller.admin.BloodRequestController.BloodAmount> sentBlood, String deliveryPerson) {
        BloodRequest req = bloodRequestRepository.findById(id).orElse(null);
        if (req == null) return null;
        // Convert sentBlood thành chuỗi
        String bloodFullfilled = sentBlood.stream()
            .map(row -> row.getGroup() + ": " + row.getAmount() + " ml")
            .collect(Collectors.joining(", "));
        req.setBloodFullfilled(bloodFullfilled);
        req.setDeliveryPerson(deliveryPerson);
        req.setProcessingStatus("in transit");
        bloodRequestRepository.save(req);
        // Trừ máu và ghi vào blood_request_stock
        for (com.blooddonation.backend.controller.admin.BloodRequestController.BloodAmount row : sentBlood) {
            String group = row.getGroup();
            Integer amount = row.getAmount();
            // Tìm blood stock theo blood group
            List<BloodStock> stocks = bloodStockRepository.findAll();
            BloodStock matchedStock = stocks.stream()
                .filter(s -> {
                    String g = s.getBloodGroup().getAboType();
                    String rh = s.getBloodGroup().getRhFactor();
                    if (rh != null) {
                        if (rh.equalsIgnoreCase("positive")) g += "+";
                        else if (rh.equalsIgnoreCase("negative")) g += "-";
                    }
                    return g.equalsIgnoreCase(group);
                })
                .findFirst().orElse(null);
            if (matchedStock == null || matchedStock.getVolume() < amount) {
                throw new RuntimeException("Không đủ máu trong kho cho nhóm " + group);
            }
            matchedStock.setVolume(matchedStock.getVolume() - amount);
            bloodStockRepository.save(matchedStock);
            // Lưu vào blood_request_stock
            BloodRequestStock brs = new BloodRequestStock();
            brs.setRequest(req);
            brs.setStock(matchedStock);
            bloodRequestStockRepository.save(brs);
        }
        // Tạo lại DTO như trong getAllRequests
        String bloodGroup = req.getBloodGroup().getAboType();
        String rh = req.getBloodGroup().getRhFactor();
        if (rh != null) {
            if (rh.equalsIgnoreCase("positive")) bloodGroup += "+";
            else if (rh.equalsIgnoreCase("negative")) bloodGroup += "-";
        }
        String emergencyLevel = req.getIsEmergency() != null && req.getIsEmergency() ? "Khẩn cấp" : "Bình thường";
        String requestStatus = "Chờ xác nhận";
        if (req.getRequestStatus() != null) {
            switch (req.getRequestStatus()) {
                case "pending": requestStatus = "Chờ xác nhận"; break;
                case "confirmed": requestStatus = "Xác nhận"; break;
                case "rejected": requestStatus = "Từ chối"; break;
                default: requestStatus = req.getRequestStatus();
            }
        }
        String processingStatusVN = "";
        if (req.getProcessingStatus() != null) {
            switch (req.getProcessingStatus()) {
                case "pending": processingStatusVN = "Chờ xử lí"; break;
                case "in transit": processingStatusVN = "Đang vận chuyển"; break;
                case "completed": processingStatusVN = "Hoàn thành"; break;
                default: processingStatusVN = req.getProcessingStatus();
            }
        }
        BloodRequestDTO dto = new BloodRequestDTO(
            req.getRequestId(),
            req.getFacility() != null ? req.getFacility().getFacilityName() : "",
            req.getFacility() != null ? req.getFacility().getAddress() : "",
            bloodGroup,
            req.getQuantityRequested(),
            emergencyLevel,
            req.getRequiredBy() != null ? req.getRequiredBy().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "",
            req.getContactPerson(),
            req.getContactPhone(),
            req.getStaff() != null ? req.getStaff().getFullName() : "",
            req.getDeliveryPerson(),
            req.getSpecialRequirements(),
            requestStatus,
            req.getIsEmergency(),
            req.getPatientInfo(),
            req.getIsCompatible(),
            processingStatusVN,
            req.getNotes(),
            req.getBloodFullfilled(),
            req.getEmergencyStatus()
        );
        return dto;
    }

    public BloodRequestDTO updateProcessingStatus(Integer id, String processingStatus) {
        BloodRequest req = bloodRequestRepository.findById(id).orElse(null);
        if (req == null) return null;
        
        // Map processing status tiếng Việt sang giá trị DB
        String dbProcessingStatus = "pending";
        if ("Đang vận chuyển".equalsIgnoreCase(processingStatus) || "in transit".equalsIgnoreCase(processingStatus)) {
            dbProcessingStatus = "in transit";
        } else if ("Hoàn thành".equalsIgnoreCase(processingStatus) || "completed".equalsIgnoreCase(processingStatus)) {
            dbProcessingStatus = "completed";
        }
        
        req.setProcessingStatus(dbProcessingStatus);
        bloodRequestRepository.save(req);
        
        return getRequestById(id);
    }

    public BloodRequestDTO updateEmergencyStatus(Integer id, String emergencyStatus) {
        BloodRequest req = bloodRequestRepository.findById(id).orElse(null);
        if (req == null) return null;
        
        // Cập nhật emergency_status thay vì is_emergency
        req.setEmergencyStatus(emergencyStatus);
        bloodRequestRepository.save(req);
        
        return getRequestById(id);
    }
} 