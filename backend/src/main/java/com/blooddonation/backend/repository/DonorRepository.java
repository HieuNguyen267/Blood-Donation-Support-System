package com.blooddonation.backend.repository;

import com.blooddonation.backend.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonorRepository extends JpaRepository<Donor, Integer> {
} 