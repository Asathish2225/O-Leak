package com.serviceapp.backend.controller;

import com.serviceapp.backend.dto.BookingRequest;
import com.serviceapp.backend.model.Booking;
import com.serviceapp.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public String createBooking(
            @RequestBody BookingRequest request
    ) {

        return bookingService.createBooking(request);
    }

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }

    @PutMapping("/{bookingId}/status")
    public String updateBookingStatus(

            @PathVariable Long bookingId,

            @RequestParam String status
    ) {

        return bookingService.updateBookingStatus(
                bookingId,
                status
        );
    }
}