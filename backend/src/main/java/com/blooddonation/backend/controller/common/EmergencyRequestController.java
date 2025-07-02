package com.blooddonation.backend.controller.common;

import com.blooddonation.backend.dto.common.EmergencyRequestDTO;
import com.blooddonation.backend.entity.common.EmergencyRequest;
import com.blooddonation.backend.service.common.EmergencyRequestService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyRequestController {
    private final EmergencyRequestService service;

    public EmergencyRequestController(EmergencyRequestService service) {
        this.service = service;
    }

    @PostMapping("/request")
    public EmergencyRequest createRequest(@RequestBody EmergencyRequestDTO dto) {
        EmergencyRequest req = new EmergencyRequest();
        req.setRequesterName(dto.getRequesterName());
        req.setBloodGroup(dto.getBloodGroup());
        req.setQuantity(dto.getQuantity());
        req.setPhone(dto.getPhone());
        req.setAddress(dto.getAddress());
        req.setNote(dto.getNote());
        return service.save(req);
    }
} 