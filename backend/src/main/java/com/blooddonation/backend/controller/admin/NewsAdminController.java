package com.blooddonation.backend.controller.admin;

import com.blooddonation.backend.dto.common.NewsDTO;
import com.blooddonation.backend.service.common.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/admin/news")
public class NewsAdminController {
    @Autowired
    private NewsService newsService;

    @Value("${upload.image.dir:uploads}")
    private String uploadDir;

    @GetMapping
    public List<NewsDTO> getAllNews() {
        return newsService.getAllNews();
    }

    @PostMapping
    public ResponseEntity<?> createNews(@RequestBody NewsDTO newsDTO) {
        NewsDTO created = newsService.createNews(newsDTO);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNews(@PathVariable Integer id, @RequestBody NewsDTO newsDTO) {
        NewsDTO updated = newsService.updateNews(id, newsDTO);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String ext = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.'));
            String filename = UUID.randomUUID() + ext;
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            Path filePath = uploadPath.resolve(filename);
            file.transferTo(filePath);
            String url = "/" + uploadDir + "/" + filename;
            return ResponseEntity.ok().body(url);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }
} 