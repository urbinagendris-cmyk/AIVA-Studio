package com.cesde.aivastudio.service;

import com.cesde.aivastudio.model.Project;
import com.cesde.aivastudio.repository.ProjectRepository;
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
        return projectRepository.save(project);
    }

    public Project update(Long id, Project projectData) {
        Project project = findById(id);
        project.setName(projectData.getName());
        project.setDescription(projectData.getDescription());
        return projectRepository.save(project);
    }

    public void delete(Long id) {
        projectRepository.delete(findById(id));
    }
}