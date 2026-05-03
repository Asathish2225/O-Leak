package com.serviceapp.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_category_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ServiceCategory serviceCategory;
}