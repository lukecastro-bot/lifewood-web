package com.example.backend.controller;

import com.example.backend.dto.LoginResponse;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://lifewood-webs.vercel.app"
})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // 🔹 Signup restricted to ADMIN only
    @PostMapping("/signup-admin")
    public ResponseEntity<?> signupAdmin(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole(2); // 🚨 force ADMIN role always
        return ResponseEntity.ok(userRepository.save(user));
    }

    // 🔹 Login (only admins can access dashboard)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {
        return userRepository.findByEmail(loginUser.getEmail())
                .map(user -> {
                    if (encoder.matches(loginUser.getPassword(), user.getPassword())) {
                        if (user.getRole() != 2) {
                            return ResponseEntity.status(403).body("Access denied: Not an admin");
                        }

                        // Role = ADMIN
                        String token = JwtUtil.generateToken(user.getEmail(), "ADMIN");
                        return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.getRole()));
                    } else {
                        return ResponseEntity.status(401).body("Incorrect password");
                    }
                })
                .orElse(ResponseEntity.status(404).body("Admin not found"));
    }
}
