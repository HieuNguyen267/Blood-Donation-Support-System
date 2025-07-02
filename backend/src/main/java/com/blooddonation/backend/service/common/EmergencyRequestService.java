package com.blooddonation.backend.service.common;

import com.blooddonation.backend.entity.common.EmergencyRequest;
import com.blooddonation.backend.repository.common.EmergencyRequestRepository;
import org.springframework.stereotype.Service;

@Service
public class EmergencyRequestService {
    private final EmergencyRequestRepository repo;

    public EmergencyRequestService(EmergencyRequestRepository repo) {
        this.repo = repo;
    }

    public EmergencyRequest save(EmergencyRequest req) {
        req.setCreatedAt(java.time.LocalDateTime.now());
        return repo.save(req);
    }
} 