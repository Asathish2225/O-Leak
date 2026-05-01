package com.serviceapp.backend.service;

import com.serviceapp.backend.dto.ServiceCategoryRequest;
import com.serviceapp.backend.model.ServiceCategory;
import com.serviceapp.backend.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceCategoryService {

    private final ServiceCategoryRepository serviceCategoryRepository;

    public String addCategory(ServiceCategoryRequest request) {

        ServiceCategory category = new ServiceCategory();

        category.setName(request.getName());

        serviceCategoryRepository.save(category);

        return "Service Category Added Successfully";
    }

    public List<ServiceCategory> getAllCategories() {

        return serviceCategoryRepository.findAll();
    }
}