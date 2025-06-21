package com.blooddonation.backend.service;

import com.blooddonation.backend.dto.BloodStockDTO;
import com.blooddonation.backend.entity.BloodStock;
import com.blooddonation.backend.entity.BloodGroup;
import com.blooddonation.backend.entity.Event;
import com.blooddonation.backend.entity.Staff;
import com.blooddonation.backend.repository.BloodStockRepository;
import com.blooddonation.backend.repository.BloodGroupRepository;
import com.blooddonation.backend.repository.EventRepository;
import com.blooddonation.backend.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodStockService {

    @Autowired
    private BloodStockRepository bloodStockRepository;

    @Autowired
    private BloodGroupRepository bloodGroupRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private StaffRepository staffRepository;

    public List<BloodStockDTO> getAllBloodStock() {
        return bloodStockRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<BloodStockDTO> getBloodStockById(Integer id) {
        return bloodStockRepository.findById(id)
                .map(this::convertToDTO);
    }

    public List<BloodStockDTO> getBloodStockByBloodGroup(Integer bloodGroupId) {
        return bloodStockRepository.findByBloodGroupBloodGroupId(bloodGroupId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodStockDTO> getBloodStockByStatus(String status) {
        return bloodStockRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodStockDTO> getAvailableBloodStock() {
        return bloodStockRepository.findByBloodGroupBloodGroupIdAndStatus(null, "available").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodStockDTO> getExpiringStock() {
        LocalDate expiryDate = LocalDate.now().plusDays(7);
        return bloodStockRepository.findExpiringStock(expiryDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BloodStockDTO createBloodStock(BloodStockDTO stockDTO) {
        BloodStock bloodStock = convertToEntity(stockDTO);
        bloodStock.setCreatedAt(LocalDateTime.now());
        bloodStock.setUpdatedAt(LocalDateTime.now());
        bloodStock.setStatus("available");
        bloodStock.setQualityCheckPassed(true);
        
        BloodStock savedStock = bloodStockRepository.save(bloodStock);
        return convertToDTO(savedStock);
    }

    public BloodStockDTO updateBloodStock(Integer id, BloodStockDTO stockDTO) {
        Optional<BloodStock> existingStock = bloodStockRepository.findById(id);
        if (existingStock.isPresent()) {
            BloodStock bloodStock = existingStock.get();
            updateEntityFromDTO(bloodStock, stockDTO);
            bloodStock.setUpdatedAt(LocalDateTime.now());
            
            BloodStock savedStock = bloodStockRepository.save(bloodStock);
            return convertToDTO(savedStock);
        }
        return null;
    }

    public boolean deleteBloodStock(Integer id) {
        if (bloodStockRepository.existsById(id)) {
            bloodStockRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public BloodStockDTO updateStockStatus(Integer id, String status) {
        Optional<BloodStock> existingStock = bloodStockRepository.findById(id);
        if (existingStock.isPresent()) {
            BloodStock bloodStock = existingStock.get();
            bloodStock.setStatus(status);
            bloodStock.setUpdatedAt(LocalDateTime.now());
            
            BloodStock savedStock = bloodStockRepository.save(bloodStock);
            return convertToDTO(savedStock);
        }
        return null;
    }

    public BloodStockDTO performQualityCheck(Integer id, Boolean passed, String notes, Integer staffId) {
        Optional<BloodStock> existingStock = bloodStockRepository.findById(id);
        if (existingStock.isPresent()) {
            BloodStock bloodStock = existingStock.get();
            bloodStock.setQualityCheckPassed(passed);
            bloodStock.setQualityCheckDate(LocalDate.now());
            bloodStock.setQualityNotes(notes);
            bloodStock.setUpdatedAt(LocalDateTime.now());
            
            if (staffId != null) {
                staffRepository.findById(staffId).ifPresent(bloodStock::setQualityCheckStaff);
            }
            
            BloodStock savedStock = bloodStockRepository.save(bloodStock);
            return convertToDTO(savedStock);
        }
        return null;
    }

    public Integer getTotalAvailableVolumeByBloodGroup(Integer bloodGroupId) {
        return bloodStockRepository.getTotalAvailableVolumeByBloodGroup(bloodGroupId);
    }

    private BloodStockDTO convertToDTO(BloodStock bloodStock) {
        BloodStockDTO dto = new BloodStockDTO();
        dto.setStockId(bloodStock.getStockId());
        if (bloodStock.getEvent() != null) {
            dto.setEventId(bloodStock.getEvent().getEventId());
            dto.setEventName(bloodStock.getEvent().getEventName());
        }
        dto.setBloodGroupId(bloodStock.getBloodGroup().getBloodGroupId());
        dto.setBloodGroupName(bloodStock.getBloodGroup().getAboType() + bloodStock.getBloodGroup().getRhFactor());
        dto.setCollectionDate(bloodStock.getCollectionDate());
        dto.setExpiryDate(bloodStock.getExpiryDate());
        dto.setVolume(bloodStock.getVolume());
        dto.setStatus(bloodStock.getStatus());
        dto.setStorageLocation(bloodStock.getStorageLocation());
        dto.setTemperatureLog(bloodStock.getTemperatureLog());
        dto.setQualityCheckPassed(bloodStock.getQualityCheckPassed());
        dto.setQualityCheckDate(bloodStock.getQualityCheckDate());
        if (bloodStock.getQualityCheckStaff() != null) {
            dto.setQualityCheckStaffId(bloodStock.getQualityCheckStaff().getStaffId());
            dto.setQualityCheckStaffName(bloodStock.getQualityCheckStaff().getFullName());
        }
        dto.setQualityNotes(bloodStock.getQualityNotes());
        dto.setBloodRequestId(bloodStock.getBloodRequestId());
        dto.setBloodRequestDate(bloodStock.getBloodRequestDate());
        dto.setCreatedAt(bloodStock.getCreatedAt());
        dto.setUpdatedAt(bloodStock.getUpdatedAt());
        return dto;
    }

    private BloodStock convertToEntity(BloodStockDTO dto) {
        BloodStock bloodStock = new BloodStock();
        updateEntityFromDTO(bloodStock, dto);
        return bloodStock;
    }

    private void updateEntityFromDTO(BloodStock bloodStock, BloodStockDTO dto) {
        if (dto.getEventId() != null) {
            eventRepository.findById(dto.getEventId())
                    .ifPresent(bloodStock::setEvent);
        }
        if (dto.getBloodGroupId() != null) {
            bloodGroupRepository.findById(dto.getBloodGroupId())
                    .ifPresent(bloodStock::setBloodGroup);
        }
        if (dto.getCollectionDate() != null) {
            bloodStock.setCollectionDate(dto.getCollectionDate());
        }
        if (dto.getExpiryDate() != null) {
            bloodStock.setExpiryDate(dto.getExpiryDate());
        }
        if (dto.getVolume() != null) {
            bloodStock.setVolume(dto.getVolume());
        }
        if (dto.getStatus() != null) {
            bloodStock.setStatus(dto.getStatus());
        }
        if (dto.getStorageLocation() != null) {
            bloodStock.setStorageLocation(dto.getStorageLocation());
        }
        if (dto.getTemperatureLog() != null) {
            bloodStock.setTemperatureLog(dto.getTemperatureLog());
        }
        if (dto.getQualityCheckPassed() != null) {
            bloodStock.setQualityCheckPassed(dto.getQualityCheckPassed());
        }
        if (dto.getQualityCheckDate() != null) {
            bloodStock.setQualityCheckDate(dto.getQualityCheckDate());
        }
        if (dto.getQualityCheckStaffId() != null) {
            staffRepository.findById(dto.getQualityCheckStaffId())
                    .ifPresent(bloodStock::setQualityCheckStaff);
        }
        if (dto.getQualityNotes() != null) {
            bloodStock.setQualityNotes(dto.getQualityNotes());
        }
        if (dto.getBloodRequestId() != null) {
            bloodStock.setBloodRequestId(dto.getBloodRequestId());
        }
        if (dto.getBloodRequestDate() != null) {
            bloodStock.setBloodRequestDate(dto.getBloodRequestDate());
        }
    }
} 