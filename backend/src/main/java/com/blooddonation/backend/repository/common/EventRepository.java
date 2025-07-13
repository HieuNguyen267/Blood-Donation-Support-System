package com.blooddonation.backend.repository.common;
import com.blooddonation.backend.entity.common.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByDateAfter(LocalDate date);
    List<Event> findByStatus(String status);
    List<Event> findByOrganizer(String organizer);
    List<Event> findByDateBetween(LocalDate startDate, LocalDate endDate);
    long countByDateAfter(LocalDate date);
} 