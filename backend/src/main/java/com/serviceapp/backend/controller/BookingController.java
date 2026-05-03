package com.serviceapp.backend.controller;

import com.serviceapp.backend.dto.BookingRequest;
import com.serviceapp.backend.model.Booking;
import com.serviceapp.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createBooking(@Valid @RequestBody BookingRequest request) {
        String message = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", message));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<Map<String, String>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam String status
    ) {
        String message = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(Map.of("message", message));
    }
}