package com.blooddonation.backend.dto.admin;

import java.time.LocalDate;

public class DonationManagementDTO {
    private Integer registerId;      // Mã đơn nhận
    private String donorName;        // Họ và tên  
    private LocalDate appointmentDate;    // Ngày hiến
    private String appointmentTime;  // Ngày và giờ hiến (formatted)
    private String status;           // Trạng thái xử lý
    private String bloodGroup;       // Nhóm máu (abo_type + rh_factor)
    private String statusDisplay;    // Trạng thái hiển thị (Vietnamese)
    private String donationStatus;
    private Integer quantityMl;
    private String staffName;        // Staff phụ trách

    // Constructors
    public DonationManagementDTO() {}

    // Original constructor (5 params) - for backward compatibility
    public DonationManagementDTO(Integer registerId, String donorName, LocalDate appointmentDate, String status, String bloodGroup) {
        this.registerId = registerId;
        this.donorName = donorName;
        this.appointmentDate = appointmentDate;
        this.status = status;
        this.bloodGroup = bloodGroup;
        this.statusDisplay = mapStatusToDisplay(status);
        this.donationStatus = null;
        this.appointmentTime = null;
    }

    // Constructor with appointmentTime (6 params) - for donation management queries
    public DonationManagementDTO(Integer registerId, String donorName, LocalDate appointmentDate, String status, String bloodGroup, String appointmentTime) {
        this.registerId = registerId;
        this.donorName = donorName;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.bloodGroup = bloodGroup;
        this.statusDisplay = mapStatusToDisplay(status);
        this.donationStatus = null;
    }

    // Constructor with appointmentTime and donationStatus (7 params) - for donation process management queries  
    public DonationManagementDTO(Integer registerId, String donorName, LocalDate appointmentDate, String appointmentTime, String status, String donationStatus, String bloodGroup, Integer quantityMl) {
        this.registerId = registerId;
        this.donorName = donorName;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.donationStatus = donationStatus;
        this.bloodGroup = bloodGroup;
        this.quantityMl = quantityMl;
        this.statusDisplay = mapStatusToDisplay(status);
    }

    // Constructor with staffName (8 params) - for donation process management queries with staff info
    public DonationManagementDTO(Integer registerId, String donorName, LocalDate appointmentDate, String appointmentTime, String status, String donationStatus, String bloodGroup, Integer quantityMl, String staffName) {
        this.registerId = registerId;
        this.donorName = donorName;
        this.appointmentDate = appointmentDate;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.donationStatus = donationStatus;
        this.bloodGroup = bloodGroup;
        this.quantityMl = quantityMl;
        this.staffName = staffName;
        this.statusDisplay = mapStatusToDisplay(status);
    }

    // Map trạng thái từ DB sang hiển thị
    private String mapStatusToDisplay(String status) {
        if (status == null) return "Chờ xác nhận";
        
        switch (status.toLowerCase()) {
            case "pending":
                return "Chờ xác nhận";
            case "confirmed":
                return "Xác nhận";
            case "cancelled":
                return "Từ chối";
            default:
                return "Chờ xác nhận";
        }
    }

    // Getters and Setters
    public Integer getRegisterId() {
        return registerId;
    }

    public void setRegisterId(Integer registerId) {
        this.registerId = registerId;
    }

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.statusDisplay = mapStatusToDisplay(status);
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getStatusDisplay() {
        return statusDisplay;
    }

    public void setStatusDisplay(String statusDisplay) {
        this.statusDisplay = statusDisplay;
    }

    public String getDonationStatus() { return donationStatus; }
    public void setDonationStatus(String donationStatus) { this.donationStatus = donationStatus; }

    public Integer getQuantityMl() { return quantityMl; }
    public void setQuantityMl(Integer quantityMl) { this.quantityMl = quantityMl; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }
} 