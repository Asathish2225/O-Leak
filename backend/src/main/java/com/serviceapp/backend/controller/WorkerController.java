package com.serviceapp.backend.controller;

import com.serviceapp.backend.dto.WorkerRequest;
import com.serviceapp.backend.model.Worker;
import com.serviceapp.backend.service.WorkerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @PostMapping
    public ResponseEntity<Map<String, String>> registerWorker(@Valid @RequestBody WorkerRequest request) {
        String message = workerService.registerWorker(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", message));
    }

    @GetMapping
    public ResponseEntity<List<Worker>> getAllWorkers() {
        return ResponseEntity.ok(workerService.getAllWorkers());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Worker>> getNearbyWorkers(
            @RequestParam Long serviceId,
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) {
        return ResponseEntity.ok(workerService.getNearbyWorkers(serviceId, latitude, longitude));
    }
}