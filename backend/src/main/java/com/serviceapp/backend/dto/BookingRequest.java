package com.serviceapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @NotBlank(message = "Customer phone is required")
    private String customerPhone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Worker ID is required")
    private Long workerId;
}