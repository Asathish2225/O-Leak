package com.serviceapp.backend.service;

import com.serviceapp.backend.dto.WorkerRequest;
import com.serviceapp.backend.model.ServiceCategory;
import com.serviceapp.backend.model.Worker;
import com.serviceapp.backend.repository.ServiceCategoryRepository;
import com.serviceapp.backend.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;

    private final ServiceCategoryRepository serviceCategoryRepository;

    public String registerWorker(WorkerRequest request) {

        ServiceCategory category = serviceCategoryRepository
                .findById(request.getServiceCategoryId())
                .orElseThrow(() -> new RuntimeException("Service Category Not Found"));

        Worker worker = new Worker();

        worker.setFullName(request.getFullName());
        worker.setPhone(request.getPhone());
        worker.setExperience(request.getExperience());
        worker.setLatitude(request.getLatitude());
        worker.setLongitude(request.getLongitude());

        worker.setAvailable(true);

        worker.setRating(0.0);

        worker.setServiceCategory(category);

        workerRepository.save(worker);

        return "Worker Registered Successfully";
    }

    public List<Worker> getAllWorkers() {

        return workerRepository.findAll();
    }

    public List<Worker> getWorkersByServiceCategory(Long serviceId) {
        return workerRepository.findByAvailableTrueAndServiceCategoryId(serviceId);
    }
}