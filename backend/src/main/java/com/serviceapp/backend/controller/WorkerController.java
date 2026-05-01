package com.serviceapp.backend.controller;

import com.serviceapp.backend.dto.WorkerRequest;
import com.serviceapp.backend.model.Worker;
import com.serviceapp.backend.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @PostMapping
    public String registerWorker(@RequestBody WorkerRequest request) {

        return workerService.registerWorker(request);
    }

    @GetMapping
    public List<Worker> getAllWorkers() {

        return workerService.getAllWorkers();
    }

    @GetMapping("/nearby")
    public List<Worker> getNearbyWorkers(

            @RequestParam Long serviceId,

            @RequestParam Double latitude,

            @RequestParam Double longitude
    ) {

        return workerService.getNearbyWorkers(
                serviceId,
                latitude,
                longitude
        );
    }
}