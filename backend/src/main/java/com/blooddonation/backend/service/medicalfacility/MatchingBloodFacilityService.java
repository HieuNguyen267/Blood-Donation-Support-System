package com.blooddonation.backend.service.medicalfacility;

import com.blooddonation.backend.dto.medicalfacility.MatchingBloodFacilityDTO;
import java.util.List;
 
public interface MatchingBloodFacilityService {
    List<MatchingBloodFacilityDTO> getMatchingByRequestId(Integer requestId);
    void updateQuantityMl(Integer matchingId, Integer quantityMl);
    void confirmCompleted(Integer matchingId);
} 