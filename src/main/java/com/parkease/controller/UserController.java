package com.parkease.controller;

import com.parkease.model.Booking;
import com.parkease.model.User;
import com.parkease.repository.BookingRepository;
import com.parkease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @CrossOrigin(origins = "*")
    @GetMapping("/{email}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("walletBalance", user.getWalletBalance());
            response.put("loyaltyPoints", user.getLoyaltyPoints());
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{userId}/bookings")
    public ResponseEntity<?> getUserBookings(@PathVariable String userId) {
        // Try finding by custom ID first
        List<Booking> bookings = bookingRepository.findByUserCustomId(userId);
        
        // Fallback: If list is empty, try by email (backward compatibility/safety)
        if(bookings.isEmpty() && userId.contains("@")) {
             bookings = bookingRepository.findByUserEmail(userId);
        }
        
        return ResponseEntity.ok(bookings);
    }
}
