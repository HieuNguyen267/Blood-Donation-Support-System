package com.blooddonation.backend.dto.common;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventDTO {
    private Integer eventId;
    private String eventName;
    private String description;
    private LocalDate date;
    private Integer targetDonors;
    private Integer registeredDonors;
    private Integer actualDonors;
    private Integer targetBloodUnits;
    private Integer collectedBloodUnits;
    private String organizer;
    private String contactPhone;
    private String status;

    public void setEventId(Integer eventId) { this.eventId = eventId; }
    public void setEventName(String eventName) { this.eventName = eventName; }
    public void setDescription(String description) { this.description = description; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalDate getDate() { return date; }
    public void setTargetDonors(Integer targetDonors) { this.targetDonors = targetDonors; }
    public void setRegisteredDonors(Integer registeredDonors) { this.registeredDonors = registeredDonors; }
    public void setActualDonors(Integer actualDonors) { this.actualDonors = actualDonors; }
    public void setTargetBloodUnits(Integer targetBloodUnits) { this.targetBloodUnits = targetBloodUnits; }
    public void setCollectedBloodUnits(Integer collectedBloodUnits) { this.collectedBloodUnits = collectedBloodUnits; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public void setStatus(String status) { this.status = status; }
} 