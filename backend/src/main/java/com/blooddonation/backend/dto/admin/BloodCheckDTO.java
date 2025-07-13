package com.blooddonation.backend.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BloodCheckDTO {
    private Integer bloodCheckId;
    private String donorName;
    private LocalDate appointmentDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer quantityMl;
    private String aboType;
    private String rhFactor;
    private String status;
    private String staffName;
    private String notes;
    
    // Helper method to get formatted blood group
    public String getBloodGroup() {
        if (aboType == null || rhFactor == null) {
            return "";
        }
        String rhSymbol = "positive".equalsIgnoreCase(rhFactor) ? "+" : 
                         "negative".equalsIgnoreCase(rhFactor) ? "-" : rhFactor;
        return aboType + rhSymbol;
    }
    
    // Helper method to get formatted appointment time
    public String getAppointmentTime() {
        if (appointmentDate == null) {
            return "";
        }
        String dateStr = appointmentDate.toString();
        if (startTime != null && endTime != null) {
            return dateStr + ", " + startTime.toString() + " - " + endTime.toString();
        }
        return dateStr;
    }
    
    // Helper method to get formatted status
    public String getFormattedStatus() {
        if (status == null) {
            return "Chờ xét nghiệm";
        }
        switch (status.toLowerCase()) {
            case "pending":
                return "Chờ xét nghiệm";
            case "approved":
                return "Đạt chuẩn";
            case "rejected":
                return "Không đạt chuẩn";
            default:
                return status;
        }
    }
} 