package com.serviceapp.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "service_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany(mappedBy = "serviceCategories")
    private List<Worker> workers;
}