package com.blooddonation.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @GetMapping
    public String test() {
        return "Hello from Blood Donation API!";
    }

    @GetMapping("/health")
    public String health() {
        return "API is running!";
    }
} 