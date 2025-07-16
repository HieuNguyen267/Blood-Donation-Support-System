package com.blooddonation.backend.service.medicalfacility;

import com.blooddonation.backend.dto.medicalfacility.MF_BloodRequestDTO;
import java.util.List;
 
public interface MF_BloodRequestHistoryService {
    List<MF_BloodRequestDTO> getBloodRequestHistory();
} 