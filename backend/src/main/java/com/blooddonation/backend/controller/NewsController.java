package com.blooddonation.backend.controller;

import com.blooddonation.backend.entity.common.News;
import com.blooddonation.backend.repository.common.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @Autowired
    private NewsRepository newsRepository;

    @GetMapping("/public")
    public ResponseEntity<List<News>> getPublicNews() {
        List<News> publicNews = newsRepository.findByStatus("public");
        return ResponseEntity.ok(publicNews);
    }

    @GetMapping
    public ResponseEntity<List<News>> getAllNews() {
        List<News> allNews = newsRepository.findAll();
        return ResponseEntity.ok(allNews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Integer id) {
        return newsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 