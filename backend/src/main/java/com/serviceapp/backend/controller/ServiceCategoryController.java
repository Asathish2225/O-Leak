package com.serviceapp.backend.controller;

import com.serviceapp.backend.dto.ServiceCategoryRequest;
import com.serviceapp.backend.model.ServiceCategory;
import com.serviceapp.backend.service.ServiceCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private final ServiceCategoryService serviceCategoryService;

    @PostMapping
    public ResponseEntity<Map<String, String>> addCategory(@Valid @RequestBody ServiceCategoryRequest request) {
        String message = serviceCategoryService.addCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", message));
    }

    @GetMapping
    public ResponseEntity<List<ServiceCategory>> getAllCategories() {
        return ResponseEntity.ok(serviceCategoryService.getAllCategories());
    }
}