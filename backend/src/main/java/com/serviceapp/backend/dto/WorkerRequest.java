package com.serviceapp.backend.dto;

import lombok.Data;

@Data
public class WorkerRequest {

    private String fullName;

    private String phone;

    private String experience;

    private Double latitude;

    private Double longitude;

    private Long serviceCategoryId;
}