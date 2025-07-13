package com.blooddonation.backend.repository.common;

import com.blooddonation.backend.entity.common.TimeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeEventRepository extends JpaRepository<TimeEvent, Integer> {
} 