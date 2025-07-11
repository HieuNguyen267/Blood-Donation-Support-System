package com.blooddonation.backend.controller.common;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
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