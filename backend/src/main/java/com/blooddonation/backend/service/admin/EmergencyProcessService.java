package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.MatchingBloodAdminDTO;
import java.util.List;
 
public interface EmergencyProcessService {
    List<MatchingBloodAdminDTO> getAcceptedDonorsByRequestId(Integer requestId);
} 