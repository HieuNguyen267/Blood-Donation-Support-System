package com.blooddonation.backend.service.medicalfacility;

import com.blooddonation.backend.dto.medicalfacility.MF_BloodRequestDTO;
import java.util.List;

public interface MF_BloodRequestService {
    MF_BloodRequestDTO createBloodRequest(MF_BloodRequestDTO dto);
    List<MF_BloodRequestDTO> getAllBloodRequests();
    MF_BloodRequestDTO getBloodRequestById(Integer id);
    boolean deleteBloodRequest(Integer id);
} 