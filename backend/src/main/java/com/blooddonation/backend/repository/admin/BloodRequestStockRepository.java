package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.BloodRequestStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodRequestStockRepository extends JpaRepository<BloodRequestStock, Long> {
} 