package com.blooddonation.backend.service.admin;

import com.blooddonation.backend.dto.admin.BloodCheckDTO;
import com.blooddonation.backend.entity.admin.BloodCheck;
import com.blooddonation.backend.entity.admin.DonationRegister;
import com.blooddonation.backend.entity.admin.Staff;
import com.blooddonation.backend.entity.donor.Donor;
import com.blooddonation.backend.entity.common.Event;
import com.blooddonation.backend.entity.common.TimeEvent;
import com.blooddonation.backend.repository.admin.BloodCheckRepository;
import com.blooddonation.backend.repository.admin.DonationRegisterRepository;
import com.blooddonation.backend.repository.admin.StaffRepository;
import com.blooddonation.backend.repository.donor.DonorRepository;
import com.blooddonation.backend.repository.common.EventRepository;
import com.blooddonation.backend.repository.common.TimeEventRepository;
import com.blooddonation.backend.repository.admin.BloodStockRepository;
import com.blooddonation.backend.entity.admin.BloodStock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BloodCheckService {

    @Autowired
    private BloodCheckRepository bloodCheckRepository;

    @Autowired
    private DonationRegisterRepository donationRegisterRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private DonorRepository donorRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private TimeEventRepository timeEventRepository;

    @Autowired
    private BloodStockRepository bloodStockRepository;

    public List<BloodCheckDTO> getAllBloodChecks() {
        return bloodCheckRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BloodCheckDTO> getBloodChecksByStatus(String status) {
        return bloodCheckRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BloodCheckDTO getBloodCheckById(Integer bloodCheckId) {
        BloodCheck bloodCheck = bloodCheckRepository.findById(bloodCheckId)
                .orElseThrow(() -> new RuntimeException("Blood check not found"));
        return convertToDTO(bloodCheck);
    }

    public BloodCheckDTO updateBloodCheckStatus(Integer bloodCheckId, String status) {
        BloodCheck bloodCheck = bloodCheckRepository.findById(bloodCheckId)
                .orElseThrow(() -> new RuntimeException("Blood check not found"));
        
        System.out.println("=== DEBUG: updateBloodCheckStatus ===");
        System.out.println("Blood check ID: " + bloodCheckId);
        System.out.println("New status: " + status);
        System.out.println("Is approved: " + "approved".equalsIgnoreCase(status));
        
        bloodCheck.setStatus(status);
        
        // Nếu đạt chuẩn thì cộng máu vào kho
        if ("approved".equalsIgnoreCase(status)) {
            System.out.println("=== Processing approved status ===");
            
            Donor donor = bloodCheck.getDonor();
            DonationRegister register = bloodCheck.getRegister();
            
            System.out.println("Donor: " + (donor != null ? donor.getDonorId() : "null"));
            System.out.println("Register: " + (register != null ? register.getRegisterId() : "null"));
            
            if (donor != null && donor.getBloodGroup() != null && register != null && register.getQuantityMl() != null) {
                System.out.println("=== All required data found ===");
                
                Integer bloodGroupId = donor.getBloodGroup().getBloodGroupId();
                Integer quantity = register.getQuantityMl();
                
                System.out.println("Blood group ID: " + bloodGroupId);
                System.out.println("Quantity ML: " + quantity);
                
                // Tìm blood_stock theo blood_group_id
                List<BloodStock> existingStocks = bloodStockRepository.findByBloodGroupBloodGroupId(Long.valueOf(bloodGroupId));
                System.out.println("Found " + existingStocks.size() + " existing blood stocks for blood group " + bloodGroupId);
                
                BloodStock stock = existingStocks.stream().findFirst().orElse(null);
                
                if (stock == null) {
                    System.out.println("=== Creating new blood stock ===");
                    stock = new BloodStock();
                    stock.setBloodGroup(donor.getBloodGroup());
                    stock.setVolume(quantity);
                } else {
                    System.out.println("=== Updating existing blood stock ===");
                    System.out.println("Current volume: " + stock.getVolume());
                    stock.setVolume((stock.getVolume() == null ? 0 : stock.getVolume()) + quantity);
                    System.out.println("New volume: " + stock.getVolume());
                }
                
                BloodStock savedStock = bloodStockRepository.save(stock);
                System.out.println("=== Saved blood stock with ID: " + savedStock.getStockId() + " ===");
                
                // Luôn gán stock vào bloodCheck (dù trước đó là null)
                bloodCheck.setStock(savedStock);
                System.out.println("=== Assigned stock to blood check ===");
            } else {
                System.out.println("=== Missing required data ===");
                System.out.println("Donor blood group: " + (donor != null && donor.getBloodGroup() != null ? "found" : "null"));
                System.out.println("Register quantity: " + (register != null ? register.getQuantityMl() : "null"));
            }
        } else {
            System.out.println("=== Status is not approved, skipping blood stock update ===");
        }
        
        BloodCheck savedBloodCheck = bloodCheckRepository.save(bloodCheck);
        System.out.println("=== Final blood check saved with stock_id: " + (savedBloodCheck.getStock() != null ? savedBloodCheck.getStock().getStockId() : "null") + " ===");
        
        return convertToDTO(savedBloodCheck);
    }

    public BloodCheckDTO updateBloodCheck(Integer bloodCheckId, java.util.Map<String, Object> request) {
        BloodCheck bloodCheck = bloodCheckRepository.findById(bloodCheckId)
                .orElseThrow(() -> new RuntimeException("Blood check not found"));
        
        System.out.println("=== DEBUG: updateBloodCheck ===");
        System.out.println("Blood check ID: " + bloodCheckId);
        System.out.println("Request data: " + request);
        
        // Update status if provided
        if (request.containsKey("status")) {
            String newStatus = (String) request.get("status");
            System.out.println("New status: " + newStatus);
            System.out.println("Is approved: " + "approved".equalsIgnoreCase(newStatus));
            
            bloodCheck.setStatus(newStatus);
            
            // Nếu đạt chuẩn thì cộng máu vào kho
            if ("approved".equalsIgnoreCase(newStatus)) {
                System.out.println("=== Processing approved status in updateBloodCheck ===");
                
                Donor donor = bloodCheck.getDonor();
                DonationRegister register = bloodCheck.getRegister();
                
                System.out.println("Donor: " + (donor != null ? donor.getDonorId() : "null"));
                System.out.println("Register: " + (register != null ? register.getRegisterId() : "null"));
                
                if (donor != null && donor.getBloodGroup() != null && register != null && register.getQuantityMl() != null) {
                    System.out.println("=== All required data found in updateBloodCheck ===");
                    
                    Integer bloodGroupId = donor.getBloodGroup().getBloodGroupId();
                    Integer quantity = register.getQuantityMl();
                    
                    System.out.println("Blood group ID: " + bloodGroupId);
                    System.out.println("Quantity ML: " + quantity);
                    
                    // Tìm blood_stock theo blood_group_id
                    List<BloodStock> existingStocks = bloodStockRepository.findByBloodGroupBloodGroupId(Long.valueOf(bloodGroupId));
                    System.out.println("Found " + existingStocks.size() + " existing blood stocks for blood group " + bloodGroupId);
                    
                    BloodStock stock = existingStocks.stream().findFirst().orElse(null);
                    
                    if (stock == null) {
                        System.out.println("=== Creating new blood stock in updateBloodCheck ===");
                        stock = new BloodStock();
                        stock.setBloodGroup(donor.getBloodGroup());
                        stock.setVolume(quantity);
                    } else {
                        System.out.println("=== Updating existing blood stock in updateBloodCheck ===");
                        System.out.println("Current volume: " + stock.getVolume());
                        stock.setVolume((stock.getVolume() == null ? 0 : stock.getVolume()) + quantity);
                        System.out.println("New volume: " + stock.getVolume());
                    }
                    
                    BloodStock savedStock = bloodStockRepository.save(stock);
                    System.out.println("=== Saved blood stock with ID: " + savedStock.getStockId() + " in updateBloodCheck ===");
                    
                    // Luôn gán stock vào bloodCheck (dù trước đó là null)
                    bloodCheck.setStock(savedStock);
                    System.out.println("=== Assigned stock to blood check in updateBloodCheck ===");
                } else {
                    System.out.println("=== Missing required data in updateBloodCheck ===");
                    System.out.println("Donor blood group: " + (donor != null && donor.getBloodGroup() != null ? "found" : "null"));
                    System.out.println("Register quantity: " + (register != null ? register.getQuantityMl() : "null"));
                }
            } else {
                System.out.println("=== Status is not approved in updateBloodCheck, skipping blood stock update ===");
            }
        }
        
        // Update notes if provided
        if (request.containsKey("notes")) {
            bloodCheck.setNotes((String) request.get("notes"));
        }
        
        // Lấy staff từ người đăng nhập
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Staff staff = staffRepository.findByAccountEmail(email);
        if (staff != null) {
            bloodCheck.setStaff(staff);
        }
        
        BloodCheck savedBloodCheck = bloodCheckRepository.save(bloodCheck);
        System.out.println("=== Final blood check saved with stock_id: " + (savedBloodCheck.getStock() != null ? savedBloodCheck.getStock().getStockId() : "null") + " in updateBloodCheck ===");
        
        return convertToDTO(savedBloodCheck);
    }

    private BloodCheckDTO convertToDTO(BloodCheck bloodCheck) {
        BloodCheckDTO dto = new BloodCheckDTO();
        dto.setBloodCheckId(bloodCheck.getBloodCheckId());
        dto.setStatus(bloodCheck.getStatus());
        dto.setNotes(bloodCheck.getNotes());

        // Get donor information
        Donor donor = bloodCheck.getDonor();
        if (donor != null) {
            dto.setDonorName(donor.getFullName());
        }

        // Get donation register information
        DonationRegister register = bloodCheck.getRegister();
        if (register != null) {
            dto.setQuantityMl(register.getQuantityMl());
            dto.setAppointmentDate(register.getAppointmentDate());

            // Get event and time information
            Event event = register.getEvent();
            if (event != null) {
                TimeEvent timeEvent = event.getTimeEvent();
                if (timeEvent != null) {
                    dto.setStartTime(timeEvent.getStartTime());
                    dto.setEndTime(timeEvent.getEndTime());
                }
            }
        }

        // Get staff information
        Staff staff = bloodCheck.getStaff();
        if (staff != null) {
            dto.setStaffName(staff.getFullName());
        }

        // Get blood group information from donor
        if (donor != null && donor.getBloodGroup() != null) {
            dto.setAboType(donor.getBloodGroup().getAboType());
            dto.setRhFactor(donor.getBloodGroup().getRhFactor());
        }

        return dto;
    }
} 