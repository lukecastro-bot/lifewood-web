package com.example.backend.controller;

import com.example.backend.entity.Application;
import com.example.backend.repository.ApplicationRepository;
import com.example.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EmailService emailService;

    // Upload directory
    private static final String UPLOAD_DIR = "C:/LifewoodUploads";

    // -------------------- SUBMIT APPLICATION --------------------
    @PostMapping("/apply")
    public ResponseEntity<?> submitApplication(
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("age") int age,
            @RequestParam("degree") String degree,
            @RequestParam("experience") String experience,
            @RequestParam("email") String email,
            @RequestParam("project") String project,
            @RequestParam("resume") MultipartFile resume) {

        try {
            // Ensure upload folder exists
            File folder = new File(UPLOAD_DIR);
            if (!folder.exists()) folder.mkdirs();

            // Save file with unique timestamp
            String filename = System.currentTimeMillis() + "_" + resume.getOriginalFilename();
            File file = new File(folder, filename);
            resume.transferTo(file);

            // Save application data to DB
            Application app = new Application();
            app.setFirstName(firstName);
            app.setLastName(lastName);
            app.setAge(age);
            app.setDegree(degree);
            app.setExperience(experience);
            app.setEmail(email);
            app.setProject(project);
            app.setResumePath(filename);
            app.setStatus(Application.Status.PENDING);

            applicationRepository.save(app);

            return ResponseEntity.ok("Application submitted successfully!");

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving resume: " + e.getMessage());
        }
    }

    // -------------------- VIEW RESUME --------------------
    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> viewResume(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
            if (!Files.exists(filePath)) return ResponseEntity.notFound().build();

            Resource resource = new UrlResource(filePath.toUri());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -------------------- GET ALL APPLICATIONS (ADMIN) --------------------
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    // -------------------- GET APPLICATION BY ID (ADMIN) --------------------
    @GetMapping("/applications/{id}")
    public ResponseEntity<Application> getApplicationById(@PathVariable Long id) {
        Optional<Application> app = applicationRepository.findById(id);
        return app.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // -------------------- UPDATE APPLICATION (ADMIN, PENDING ONLY) --------------------
    @PutMapping("/applications/{id}")
    public ResponseEntity<Application> updateApplication(@PathVariable Long id,
                                                         @RequestBody Application updatedApp) {
        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (!optionalApp.isPresent()) return ResponseEntity.notFound().build();

        Application app = optionalApp.get();
        if (app.getStatus() != Application.Status.PENDING) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        app.setFirstName(updatedApp.getFirstName());
        app.setLastName(updatedApp.getLastName());
        app.setAge(updatedApp.getAge());
        app.setDegree(updatedApp.getDegree());
        app.setExperience(updatedApp.getExperience());
        app.setEmail(updatedApp.getEmail());
        app.setProject(updatedApp.getProject());

        return ResponseEntity.ok(applicationRepository.save(app));
    }

    // -------------------- UPDATE STATUS (ADMIN) --------------------
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id,
                                                    @RequestBody StatusUpdateRequest request) {
        Optional<Application> optionalApp = applicationRepository.findById(id);
        if (!optionalApp.isPresent()) return ResponseEntity.notFound().build();

        Application app = optionalApp.get();
        try {
            app.setStatus(Application.Status.valueOf(request.getStatus().toUpperCase()));
            Application updated = applicationRepository.save(app);

            // Send email notifications
            if ("ACCEPTED".equalsIgnoreCase(request.getStatus())) {
                emailService.sendEmail(app.getEmail(), "Application Accepted",
                        "Hello " + app.getFirstName() + ",\n\nYour application has been accepted!");
            } else if ("DECLINED".equalsIgnoreCase(request.getStatus())) {
                emailService.sendEmail(app.getEmail(), "Application Declined",
                        "Hello " + app.getFirstName() + ",\n\nYour application has been declined.");
            }

            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // -------------------- STATUS UPDATE REQUEST --------------------
    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
