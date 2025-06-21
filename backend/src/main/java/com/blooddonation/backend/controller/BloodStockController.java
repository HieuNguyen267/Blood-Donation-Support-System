package com.blooddonation.backend.controller;

import com.blooddonation.backend.dto.BloodStockDTO;
import com.blooddonation.backend.service.BloodStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood-stock")
@CrossOrigin(origins = "*")
public class BloodStockController {

    @Autowired
    private BloodStockService bloodStockService;

    @GetMapping
    public ResponseEntity<List<BloodStockDTO>> getAllBloodStock() {
        List<BloodStockDTO> stock = bloodStockService.getAllBloodStock();
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodStockDTO> getBloodStockById(@PathVariable Integer id) {
        return bloodStockService.getBloodStockById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/blood-group/{bloodGroupId}")
    public ResponseEntity<List<BloodStockDTO>> getBloodStockByBloodGroup(@PathVariable Integer bloodGroupId) {
        List<BloodStockDTO> stock = bloodStockService.getBloodStockByBloodGroup(bloodGroupId);
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BloodStockDTO>> getBloodStockByStatus(@PathVariable String status) {
        List<BloodStockDTO> stock = bloodStockService.getBloodStockByStatus(status);
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/available")
    public ResponseEntity<List<BloodStockDTO>> getAvailableBloodStock() {
        List<BloodStockDTO> stock = bloodStockService.getAvailableBloodStock();
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<BloodStockDTO>> getExpiringStock() {
        List<BloodStockDTO> stock = bloodStockService.getExpiringStock();
        return ResponseEntity.ok(stock);
    }

    @GetMapping("/blood-group/{bloodGroupId}/total-volume")
    public ResponseEntity<Integer> getTotalAvailableVolumeByBloodGroup(@PathVariable Integer bloodGroupId) {
        Integer totalVolume = bloodStockService.getTotalAvailableVolumeByBloodGroup(bloodGroupId);
        return ResponseEntity.ok(totalVolume);
    }

    @PostMapping
    public ResponseEntity<BloodStockDTO> createBloodStock(@RequestBody BloodStockDTO stockDTO) {
        try {
            BloodStockDTO createdStock = bloodStockService.createBloodStock(stockDTO);
            return ResponseEntity.ok(createdStock);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BloodStockDTO> updateBloodStock(@PathVariable Integer id, @RequestBody BloodStockDTO stockDTO) {
        BloodStockDTO updatedStock = bloodStockService.updateBloodStock(id, stockDTO);
        if (updatedStock != null) {
            return ResponseEntity.ok(updatedStock);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BloodStockDTO> updateStockStatus(@PathVariable Integer id, @RequestParam String status) {
        BloodStockDTO updatedStock = bloodStockService.updateStockStatus(id, status);
        if (updatedStock != null) {
            return ResponseEntity.ok(updatedStock);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/quality-check")
    public ResponseEntity<BloodStockDTO> performQualityCheck(
            @PathVariable Integer id,
            @RequestParam Boolean passed,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) Integer staffId) {
        BloodStockDTO updatedStock = bloodStockService.performQualityCheck(id, passed, notes, staffId);
        if (updatedStock != null) {
            return ResponseEntity.ok(updatedStock);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloodStock(@PathVariable Integer id) {
        boolean deleted = bloodStockService.deleteBloodStock(id);
        if (deleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 