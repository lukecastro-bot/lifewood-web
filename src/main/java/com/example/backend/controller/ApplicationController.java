package com.example.backend.controller;

import com.example.backend.entity.Application;
import com.example.backend.repository.ApplicationRepository;
import com.example.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // -------------------- SUBMIT APPLICATION --------------------
    @PostMapping("/apply")
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationRequest request) {
        try {
            Application app = new Application();
            app.setFirstName(request.getFirstName());
            app.setLastName(request.getLastName());
            app.setAge(request.getAge());
            app.setDegree(request.getDegree());
            app.setExperience(request.getExperience());
            app.setEmail(request.getEmail());
            app.setProject(request.getProject());
            app.setStatus(Application.Status.PENDING);

            applicationRepository.save(app);

            return ResponseEntity.ok("Application submitted successfully!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving application: " + e.getMessage());
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

    // -------------------- APPLICATION REQUEST DTO --------------------
    public static class ApplicationRequest {
        private String firstName;
        private String lastName;
        private int age;
        private String degree;
        private String experience;
        private String email;
        private String project;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public int getAge() { return age; }
        public void setAge(int age) { this.age = age; }
        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }
        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getProject() { return project; }
        public void setProject(String project) { this.project = project; }
    }
}
