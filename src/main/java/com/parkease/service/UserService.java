package com.parkease.service;

import com.parkease.model.User;
import com.parkease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        // In a real app, hash password here using BCrypt
        // user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user");
        }

        // Generate Custom ID
        // This is a simple logic. For high concurrency, use a sequence or dedicated
        // table.
        Long lastId = userRepository.getLastInsertedId();
        if (lastId == null)
            lastId = 0L;
        long nextId = lastId + 1;

        String prefix = "USER";
        if ("admin".equalsIgnoreCase(user.getRole())) {
            prefix = "ADMIN";
        }

        // Format: USER001, ADMIN005
        String customId = String.format("%s%03d", prefix, nextId);
        user.setCustomId(customId);

        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // In a real app, use passwordEncoder.matches(password, user.getPassword())
            if (user.getPassword().equals(password)) {
                // Generate Custom ID for existing users if missing
                if (user.getCustomId() == null) {
                    Long dbId = user.getId();

                    String prefix = "USER";
                    if ("admin".equalsIgnoreCase(user.getRole())) {
                        prefix = "ADMIN";
                    }
                    user.setCustomId(String.format("%s%03d", prefix, dbId));
                    userRepository.save(user);
                }
                return user;
            }
        }
        return null;
    }
}
