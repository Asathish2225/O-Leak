package com.serviceapp.backend.dto;

import lombok.Data;

@Data
public class BookingRequest {

    private String customerName;

    private String customerPhone;

    private String address;

    private Long workerId;
}