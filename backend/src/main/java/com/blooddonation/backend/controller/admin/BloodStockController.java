package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.admin.BloodStockDTO;
import com.blooddonation.backend.service.admin.BloodStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/blood-stocks")
@CrossOrigin(origins = "*")
public class BloodStockController {
    
    @Autowired
    private BloodStockService bloodStockService;
    
    @GetMapping
    public ResponseEntity<List<BloodStockDTO>> getAllBloodStocks() {
        List<BloodStockDTO> bloodStocks = bloodStockService.getAllBloodStocks();
        return ResponseEntity.ok(bloodStocks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BloodStockDTO> getBloodStockById(@PathVariable Long id) {
        Optional<BloodStockDTO> bloodStock = bloodStockService.getBloodStockById(id);
        return bloodStock.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createBloodStock(@RequestBody BloodStockDTO bloodStockDTO) {
        try {
            BloodStockDTO createdBloodStock = bloodStockService.createBloodStock(bloodStockDTO);
            return ResponseEntity.ok(createdBloodStock);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBloodStock(@PathVariable Long id, @RequestBody BloodStockDTO bloodStockDTO) {
        try {
            BloodStockDTO updatedBloodStock = bloodStockService.updateBloodStock(id, bloodStockDTO);
            return ResponseEntity.ok(updatedBloodStock);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBloodStock(@PathVariable Long id) {
        try {
            bloodStockService.deleteBloodStock(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/blood-group/{bloodGroupId}/volume")
    public ResponseEntity<Integer> getTotalVolumeByBloodGroup(@PathVariable Long bloodGroupId) {
        Integer volume = bloodStockService.getTotalVolumeByBloodGroup(bloodGroupId);
        return ResponseEntity.ok(volume);
    }

    @PatchMapping("/{id}/add")
    public ResponseEntity<?> addVolume(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        int amount = body.getOrDefault("amount", 0);
        try {
            BloodStockDTO updated = bloodStockService.addVolume(id, amount);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/subtract")
    public ResponseEntity<?> subtractVolume(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        int amount = body.getOrDefault("amount", 0);
        try {
            BloodStockDTO updated = bloodStockService.subtractVolume(id, amount);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 