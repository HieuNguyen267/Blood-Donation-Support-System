package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.BloodStockDTO;
import com.blooddonation.backend.entity.admin.BloodGroup;
import com.blooddonation.backend.entity.admin.BloodStock;
import com.blooddonation.backend.repository.admin.BloodGroupRepository;
import com.blooddonation.backend.repository.admin.BloodStockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodStockService {
    
    @Autowired
    private BloodStockRepository bloodStockRepository;
    
    @Autowired
    private BloodGroupRepository bloodGroupRepository;
    
    public List<BloodStockDTO> getAllBloodStocks() {
        List<BloodStock> bloodStocks = bloodStockRepository.findAll();
        return bloodStocks.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public Optional<BloodStockDTO> getBloodStockById(Long id) {
        return bloodStockRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    public BloodStockDTO createBloodStock(BloodStockDTO bloodStockDTO) {
        Optional<BloodGroup> bloodGroup = bloodGroupRepository.findById(bloodStockDTO.getBloodGroupId().intValue());
        if (bloodGroup.isEmpty()) {
            throw new RuntimeException("Blood group not found");
        }
        
        BloodStock bloodStock = convertToEntity(bloodStockDTO);
        bloodStock.setBloodGroup(bloodGroup.get());
        
        BloodStock savedBloodStock = bloodStockRepository.save(bloodStock);
        return convertToDTO(savedBloodStock);
    }
    
    public BloodStockDTO updateBloodStock(Long id, BloodStockDTO bloodStockDTO) {
        Optional<BloodStock> existingBloodStock = bloodStockRepository.findById(id);
        if (existingBloodStock.isEmpty()) {
            throw new RuntimeException("Blood stock not found");
        }
        
        Optional<BloodGroup> bloodGroup = bloodGroupRepository.findById(bloodStockDTO.getBloodGroupId().intValue());
        if (bloodGroup.isEmpty()) {
            throw new RuntimeException("Blood group not found");
        }
        
        BloodStock bloodStock = existingBloodStock.get();
        bloodStock.setBloodGroup(bloodGroup.get());
        bloodStock.setVolume(bloodStockDTO.getVolume());
        
        BloodStock updatedBloodStock = bloodStockRepository.save(bloodStock);
        return convertToDTO(updatedBloodStock);
    }
    
    public void deleteBloodStock(Long id) {
        if (!bloodStockRepository.existsById(id)) {
            throw new RuntimeException("Blood stock not found");
        }
        bloodStockRepository.deleteById(id);
    }
    
    public Integer getTotalVolumeByBloodGroup(Long bloodGroupId) {
        return bloodStockRepository.getTotalVolumeByBloodGroupId(bloodGroupId);
    }
    
    private String getTemperatureRange(String aboType, String rhFactor) {
        String bloodGroup = aboType + (rhFactor.equals("positive") ? "+" : 
                                     rhFactor.equals("negative") ? "-" : rhFactor);
        
        switch (bloodGroup) {
            case "A+":
            case "A-":
            case "B+":
            case "B-":
            case "AB+":
            case "AB-":
            case "O+":
            case "O-":
                return "2-6 °C";
            case "Rh Null":
            case "Bombay":
                return "-65 °C trở xuống";
            default:
                return "2-6 °C";
        }
    }
    
    private String formatBloodGroupName(String aboType, String rhFactor) {
        if (aboType == null || rhFactor == null) {
            return "";
        }
        
        String rhSymbol;
        if (rhFactor.equals("positive")) {
            rhSymbol = "+";
        } else if (rhFactor.equals("negative")) {
            rhSymbol = "-";
        } else {
            rhSymbol = rhFactor;
        }
        
        return aboType + rhSymbol;
    }
    
    private BloodStockDTO convertToDTO(BloodStock bloodStock) {
        BloodStockDTO dto = new BloodStockDTO();
        dto.setStockId(bloodStock.getStockId());
        dto.setBloodGroupId(bloodStock.getBloodGroup().getBloodGroupId().longValue());
        dto.setAboType(bloodStock.getBloodGroup().getAboType());
        dto.setRhFactor(bloodStock.getBloodGroup().getRhFactor());
        dto.setBloodGroupName(formatBloodGroupName(bloodStock.getBloodGroup().getAboType(), 
                                                 bloodStock.getBloodGroup().getRhFactor()));
        dto.setVolume(bloodStock.getVolume());
        dto.setTemperatureRange(getTemperatureRange(bloodStock.getBloodGroup().getAboType(), 
                                                 bloodStock.getBloodGroup().getRhFactor()));
        return dto;
    }
    
    private BloodStock convertToEntity(BloodStockDTO dto) {
        BloodStock bloodStock = new BloodStock();
        bloodStock.setStockId(dto.getStockId());
        bloodStock.setVolume(dto.getVolume());
        return bloodStock;
    }
} 