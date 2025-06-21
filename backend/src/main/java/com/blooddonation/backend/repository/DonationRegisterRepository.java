package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.DonationRegister;
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
} 