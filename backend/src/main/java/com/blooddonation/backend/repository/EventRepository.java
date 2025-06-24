package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByStartDateAfter(LocalDate date);
    List<Event> findByStatus(String status);
    List<Event> findByOrganizer(String organizer);
    List<Event> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    // Analytics methods
    long countByStartDateAfter(LocalDate date);
} 