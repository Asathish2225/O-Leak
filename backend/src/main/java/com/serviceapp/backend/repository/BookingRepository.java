package com.serviceapp.backend.repository;

import com.serviceapp.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findById(Long id);
    List<Booking> findByUserId(Long userId);
}