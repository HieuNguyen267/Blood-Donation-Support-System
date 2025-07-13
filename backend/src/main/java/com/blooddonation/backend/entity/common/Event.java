package com.blooddonation.backend.entity.common;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Event")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Integer eventId;

    @Column(name = "event_name", nullable = false, length = 200)
    private String eventName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_event_id")
    private TimeEvent timeEvent;

    @Column(name = "target_donors")
    private Integer targetDonors;

    @Column(name = "registered_donors")
    private Integer registeredDonors = 0;

    @Column(name = "actual_donors")
    private Integer actualDonors = 0;

    @Column(name = "target_blood_units")
    private Integer targetBloodUnits;

    @Column(name = "collected_blood_units")
    private Integer collectedBloodUnits = 0;

    @Column(length = 100)
    private String organizer;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(length = 20)
    private String status = "planned";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setRegisteredDonors(int registeredDonors) {
        this.registeredDonors = registeredDonors;
    }

    public void setActualDonors(int actualDonors) {
        this.actualDonors = actualDonors;
    }

    public void setCollectedBloodUnits(int collectedBloodUnits) {
        this.collectedBloodUnits = collectedBloodUnits;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getEventId() { return eventId; }
    public String getEventName() { return eventName; }
    public String getDescription() { return description; }
    public LocalDate getDate() { return date; }
    public TimeEvent getTimeEvent() { return timeEvent; }
    public void setTimeEvent(TimeEvent timeEvent) { this.timeEvent = timeEvent; }
    public Integer getTargetDonors() { return targetDonors; }
    public Integer getRegisteredDonors() { return registeredDonors; }
    public Integer getActualDonors() { return actualDonors; }
    public Integer getTargetBloodUnits() { return targetBloodUnits; }
    public Integer getCollectedBloodUnits() { return collectedBloodUnits; }
    public String getOrganizer() { return organizer; }
    public String getContactPhone() { return contactPhone; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
} 