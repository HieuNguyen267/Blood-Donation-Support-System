package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.DonationRegister;
import com.blooddonation.backend.dto.admin.DonationManagementDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationRegisterRepository extends JpaRepository<DonationRegister, Integer> {
    
    // Query chính cho Donation Management với join bảng donor, blood_group và time_event
    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "dr.status, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END) " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "WHERE dr.status IN ('pending', 'confirmed', 'Not meeting health requirements') " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findAllForManagement();

    // Query với filter theo status
    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "dr.status, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END) " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "WHERE dr.status = :status " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findByStatusForManagement(@Param("status") String status);

    // Query với filter theo nhóm máu
    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "dr.status, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END) " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "WHERE dr.status IN ('pending', 'confirmed', 'Not meeting health requirements') " +
           "AND bg.aboType = :aboType AND bg.rhFactor = :rhFactor " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findByBloodGroupForManagement(@Param("aboType") String aboType, 
                                                              @Param("rhFactor") String rhFactor);

    // Query với search theo tên
    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "dr.status, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END) " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "WHERE dr.status IN ('pending', 'confirmed', 'Not meeting health requirements') " +
           "AND LOWER(d.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findByDonorNameForManagement(@Param("searchTerm") String searchTerm);

    // Existing queries
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

    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END, " +
           "dr.status, " +
           "dr.donationStatus, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "dr.quantityMl, " +
           "COALESCE(s.fullName, '')" +
           ") " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "LEFT JOIN dr.staff s " +
           "WHERE dr.donationStatus IN ('processing', 'deferred', 'completed') " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findAllForProcessManagement();

    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END, " +
           "dr.status, " +
           "dr.donationStatus, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "dr.quantityMl, " +
           "COALESCE(s.fullName, '')" +
           ") " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "LEFT JOIN dr.staff s " +
           "WHERE dr.donationStatus = :donationStatus " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findByStatusForProcessManagement(@Param("donationStatus") String donationStatus);

    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END, " +
           "dr.status, " +
           "dr.donationStatus, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "dr.quantityMl, " +
           "COALESCE(s.fullName, '')" +
           ") " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "LEFT JOIN dr.staff s " +
           "WHERE dr.donationStatus IN ('processing', 'deferred', 'completed') " +
           "AND bg.aboType = :aboType AND bg.rhFactor = :rhFactor " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findByBloodGroupForProcessManagement(@Param("aboType") String aboType, @Param("rhFactor") String rhFactor);

    @Query("SELECT new com.blooddonation.backend.dto.admin.DonationManagementDTO(" +
           "dr.registerId, " +
           "d.fullName, " +
           "dr.appointmentDate, " +
           "CASE WHEN dr.timeEvent.startTime IS NOT NULL AND dr.timeEvent.endTime IS NOT NULL " +
           "     THEN CONCAT(FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y'), ', ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.startTime, '%H:%i'), ' - ', " +
           "                 FUNCTION('TIME_FORMAT', dr.timeEvent.endTime, '%H:%i')) " +
           "     ELSE FUNCTION('DATE_FORMAT', dr.appointmentDate, '%d/%m/%Y') END, " +
           "dr.status, " +
           "dr.donationStatus, " +
           "CONCAT(bg.aboType, " +
           "CASE WHEN bg.rhFactor = 'positive' THEN '+' " +
           "     WHEN bg.rhFactor = 'negative' THEN '-' " +
           "     ELSE '' END), " +
           "dr.quantityMl, " +
           "COALESCE(s.fullName, '')" +
           ") " +
           "FROM DonationRegister dr " +
           "JOIN dr.donor d " +
           "JOIN d.bloodGroup bg " +
           "LEFT JOIN dr.timeEvent " +
           "LEFT JOIN dr.staff s " +
           "WHERE dr.donationStatus IN ('processing', 'deferred', 'completed') " +
           "AND LOWER(d.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "ORDER BY dr.createdAt DESC")
    List<DonationManagementDTO> findByDonorNameForProcessManagement(@Param("searchTerm") String searchTerm);

    @Query("SELECT dr FROM DonationRegister dr WHERE dr.status = 'confirmed' AND dr.donationStatus = 'processing' AND dr.appointmentDate >= :today AND dr.appointmentDate <= :maxDate")
    List<DonationRegister> findUpcomingConfirmedProcessing(@Param("today") LocalDate today, @Param("maxDate") LocalDate maxDate);
} 