package com.blooddonation.backend.service.medicalfacility;

import com.blooddonation.backend.dto.medicalfacility.MF_BloodRequestDTO;
import java.util.List;
import com.blooddonation.backend.service.medicalfacility.MF_BloodRequestHistoryService;
import com.blooddonation.backend.dto.medicalfacility.BloodRequestSummaryDTO;

public interface MF_BloodRequestService {
    MF_BloodRequestDTO createBloodRequest(MF_BloodRequestDTO dto);
    List<MF_BloodRequestDTO> getAllBloodRequests();
    MF_BloodRequestDTO getBloodRequestById(Integer id);
    boolean deleteBloodRequest(Integer id);
    List<MF_BloodRequestDTO> getBloodRequestHistory();
    List<com.blooddonation.backend.dto.medicalfacility.MatchingBloodFacilityDTO> getAcceptedMatchingByRequestId(Integer requestId);
    BloodRequestSummaryDTO getBloodRequestSummary(Integer requestId);
    // Thêm hàm hoàn thành quá trình khẩn cấp
    void completeEmergencyProcess(Integer requestId);
} 