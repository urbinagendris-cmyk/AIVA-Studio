package com.cesde.aivastudio.repository;

import com.cesde.aivastudio.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	boolean existsByNameIgnoreCase(String name);
}