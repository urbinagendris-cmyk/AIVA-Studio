package com.cesde.aivastudio.service;

import com.cesde.aivastudio.model.Project;
import com.cesde.aivastudio.repository.ProjectRepository;
import com.cesde.aivastudio.exception.BusinessRuleException;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public Project findById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + id));
    }

    public Project save(Project project) {
        validateProject(project);
        if (projectRepository.existsByNameIgnoreCase(project.getName().trim())) {
            throw new BusinessRuleException("Ya existe un proyecto con ese nombre");
        }
        project.setName(project.getName().trim());
        return projectRepository.save(project);
    }

    public Project update(Long id, Project projectData) {
        Project project = findById(id);
        validateProject(projectData);
        if (!project.getName().equalsIgnoreCase(projectData.getName().trim())
                && projectRepository.existsByNameIgnoreCase(projectData.getName().trim())) {
            throw new BusinessRuleException("Ya existe un proyecto con ese nombre");
        }
        project.setName(projectData.getName());
        project.setDescription(projectData.getDescription());
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.delete(findById(id));
    }

    private void validateProject(Project project) {
        if (project.getName() == null || project.getName().isBlank()) {
            throw new BusinessRuleException("El nombre del proyecto es obligatorio");
        }
        if (project.getName().trim().length() > 80) {
            throw new BusinessRuleException("El nombre del proyecto no puede superar 80 caracteres");
        }
    }
}