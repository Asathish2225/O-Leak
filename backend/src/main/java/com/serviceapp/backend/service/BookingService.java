package com.serviceapp.backend.service;

import com.serviceapp.backend.dto.BookingRequest;
import com.serviceapp.backend.model.Booking;
import com.serviceapp.backend.model.Worker;
import com.serviceapp.backend.repository.BookingRepository;
import com.serviceapp.backend.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    private final WorkerRepository workerRepository;

    public String createBooking(BookingRequest request) {

        Worker worker = workerRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("Worker Not Found"));

        if (!worker.getAvailable()) {
            return "Worker Not Available";
        }

        Booking booking = new Booking();

        booking.setCustomerName(request.getCustomerName());
        booking.setCustomerPhone(request.getCustomerPhone());
        booking.setAddress(request.getAddress());

        booking.setStatus("PENDING");

        booking.setBookingTime(LocalDateTime.now());

        booking.setWorker(worker);

        bookingRepository.save(booking);

        // Worker becomes busy
        worker.setAvailable(false);

        workerRepository.save(worker);

        return "Booking Created Successfully";
    }

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    public String updateBookingStatus(
            Long bookingId,
            String status
    ) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking Not Found"));

        booking.setStatus(status);

        bookingRepository.save(booking);

        // If booking completed or cancelled,
        // worker becomes available again

        if (
                status.equalsIgnoreCase("COMPLETED")
                        || status.equalsIgnoreCase("CANCELLED")
        ) {

            Worker worker = booking.getWorker();

            worker.setAvailable(true);

            workerRepository.save(worker);
        }

        return "Booking Status Updated Successfully";
    }
}