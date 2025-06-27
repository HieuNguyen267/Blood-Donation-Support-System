package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.DonationRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationRegisterRepository extends JpaRepository<DonationRegister, Integer> {
    @Query("SELECT dr FROM DonationRegister dr WHERE dr.donor.donorId = :donorId")
    List<DonationRegister> findByDonorDonorId(@Param("donorId") Integer donorId);

    @Query("SELECT dr FROM DonationRegister dr WHERE dr.event.eventId = :eventId")
    List<DonationRegister> findByEventEventId(@Param("eventId") Integer eventId);

    @Query("SELECT dr FROM DonationRegister dr WHERE dr.staff.staffId = :staffId")
    List<DonationRegister> findByStaffStaffId(@Param("staffId") Integer staffId);

    List<DonationRegister> findByAppointmentDate(LocalDate appointmentDate);
    List<DonationRegister> findByDonationStatus(String status);
    List<DonationRegister> findByStatus(String status);

    // Analytics methods
    @Query("SELECT DATE(dr.createdAt), COUNT(dr) FROM DonationRegister dr WHERE dr.createdAt >= :startDate AND dr.createdAt <= :endDate GROUP BY DATE(dr.createdAt)")
    List<Object[]> getRegistrationsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT dr.donationStatus, COUNT(dr) FROM DonationRegister dr GROUP BY dr.donationStatus")
    List<Object[]> getRegistrationsByStatus();

    @Query("SELECT dr.event.eventName, COUNT(dr) FROM DonationRegister dr WHERE dr.event IS NOT NULL GROUP BY dr.event.eventName")
    List<Object[]> getRegistrationsByEvent();
} 