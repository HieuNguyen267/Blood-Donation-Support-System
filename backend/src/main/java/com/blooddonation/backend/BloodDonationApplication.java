package com.blooddonation.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"com.blooddonation", "com.blooddonation.backend"})
@EnableJpaRepositories(basePackages = {"com.blooddonation.backend.repository"})
@EntityScan(basePackages = {"com.blooddonation.backend.entity"})
@EnableScheduling
public class BloodDonationApplication {

    public static void main(String[] args) {
        SpringApplication.run(BloodDonationApplication.class, args);
    }
} 