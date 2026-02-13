package com.parkease.controller;

import com.parkease.dto.BookingRequest;
import com.parkease.model.Booking;
import com.parkease.model.User;
import com.parkease.repository.BookingRepository;
import com.parkease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @CrossOrigin(origins = "*")
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        System.out.println("Received booking request: " + request);
        Optional<User> userOpt = userRepository.findByCustomId(request.getUserId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            Booking booking = new Booking();
            booking.setUser(user);
            booking.setLocationName(request.getLocationName());
            booking.setDurationInHours(request.getDuration());
            booking.setTotalPrice(request.getPrice());
            booking.setStatus("Active");

            // Parse time
            try {
                // Expecting ISO format or standard 'yyyy-MM-dd HH:mm'
                // For simplicity, let's assume standard ISO or simple parsing
                // frontend normally sends ISO string: "2023-10-27T10:00:00"
                booking.setStartTime(LocalDateTime.parse(request.getStartTime()));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid time format"));
            }

            bookingRepository.save(booking);

            // Update user wallet/loyalty points logic could go here
            // For now, just save booking

            return ResponseEntity
                    .ok(Map.of("success", true, "message", "Booking confirmed!", "bookingId", booking.getId()));
        }
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus("Cancelled");
            bookingRepository.save(booking);
            return ResponseEntity.ok(Map.of("success", true, "message", "Booking cancelled"));
        }
        return ResponseEntity.notFound().build();
    }
}
