package com.serviceapp.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String customerPhone;

    private String address;

    private String status;

    private LocalDateTime bookingTime;

    @ManyToOne
    @JoinColumn(name = "worker_id")
    private Worker worker;
}