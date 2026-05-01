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

    public List<Worker> getNearbyWorkers(
            Long serviceId,
            Double customerLat,
            Double customerLon
    ) {

        List<Worker> workers =
                workerRepository.findByAvailableTrueAndServiceCategoryId(serviceId);

        return workers.stream()
                .filter(worker -> {

                    double distance = calculateDistance(
                            customerLat,
                            customerLon,
                            worker.getLatitude(),
                            worker.getLongitude()
                    );

                    return distance <= 5;
                })
                .toList();
    }

    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2
    ) {

        final int EARTH_RADIUS = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a =
                Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                        + Math.cos(Math.toRadians(lat1))
                        * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2)
                        * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}