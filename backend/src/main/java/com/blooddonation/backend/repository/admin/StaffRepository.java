package com.blooddonation.backend.repository.admin;

import com.blooddonation.backend.entity.admin.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {
    List<Staff> findByAccountAccountId(Integer accountId);
} 