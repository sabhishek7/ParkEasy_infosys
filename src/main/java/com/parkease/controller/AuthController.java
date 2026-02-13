package com.parkease.controller;

import com.parkease.model.User;
import com.parkease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @CrossOrigin(origins = "*") // Allow requests from any origin for development
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.authenticateUser(email, password);

        Map<String, Object> response = new HashMap<>();
        if (user != null) {
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("user", Map.of("email", user.getEmail(), "role", user.getRole(), "name",
                    user.getName() != null ? user.getName() : "User", "id", user.getCustomId()));
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userDetails) {
        String email = userDetails.get("email");
        String password = userDetails.get("password");
        String adminCode = userDetails.get("adminCode"); // Optional admin code

        try {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(password);
            newUser.setName("New User"); // Default name, can be expanded later

            // Check for secret admin code
            if ("ADMIN123".equals(adminCode)) {
                newUser.setRole("admin");
            } else {
                newUser.setRole("user");
            }

            User savedUser = userService.registerUser(newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user",
                    Map.of("email", savedUser.getEmail(), "role", savedUser.getRole(), "name", savedUser.getName(),
                            "id", savedUser.getCustomId()));
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
