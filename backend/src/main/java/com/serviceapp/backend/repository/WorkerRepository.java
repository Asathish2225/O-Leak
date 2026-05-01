package com.serviceapp.backend.repository;

import com.serviceapp.backend.model.Worker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    List<Worker> findByAvailableTrue();

    List<Worker> findByAvailableTrueAndServiceCategoryId(Long serviceId);
}