package com.serviceapp.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "workers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String phone;

    private String experience;

    private Double latitude;

    private Double longitude;

    private Double rating;

    private Boolean available;

    @ManyToMany
    @JoinTable(
            name = "worker_services",
            joinColumns = @JoinColumn(name = "worker_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private List<ServiceCategory> serviceCategories;
}