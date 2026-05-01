package com.serviceapp.backend.controller;

import com.serviceapp.backend.dto.ServiceCategoryRequest;
import com.serviceapp.backend.model.ServiceCategory;
import com.serviceapp.backend.service.ServiceCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceCategoryController {

    private final ServiceCategoryService serviceCategoryService;

    @PostMapping
    public String addCategory(@RequestBody ServiceCategoryRequest request) {

        return serviceCategoryService.addCategory(request);
    }

    @GetMapping
    public List<ServiceCategory> getAllCategories() {

        return serviceCategoryService.getAllCategories();
    }
}