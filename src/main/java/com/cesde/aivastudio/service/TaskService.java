package com.cesde.aivastudio.service;

import com.cesde.aivastudio.model.Project;
import com.cesde.aivastudio.model.Task;
import com.cesde.aivastudio.repository.TaskRepository;
import com.cesde.aivastudio.exception.BusinessRuleException;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    public TaskService(TaskRepository taskRepository, ProjectService projectService) {
        this.taskRepository = taskRepository;
        this.projectService = projectService;
    }

    public List<Task> findByProjectId(Long projectId) {
        projectService.findById(projectId);
        return taskRepository.findByProjectId(projectId);
    }

    public Task save(Long projectId, Task task) {
        Project project = projectService.findById(projectId);
        validateTask(task);
        project.addTask(task);
        return taskRepository.save(task);
    }

    private void validateTask(Task task) {
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new BusinessRuleException("El titulo de la tarea es obligatorio");
        }
        if (task.getTitle().trim().length() > 120) {
            throw new BusinessRuleException("El titulo de la tarea no puede superar 120 caracteres");
        }
        Set<String> allowedStatuses = Set.of("PENDIENTE", "EN_PROGRESO", "COMPLETADA");
        if (task.getStatus() == null || !allowedStatuses.contains(task.getStatus().trim().toUpperCase())) {
            throw new BusinessRuleException("El estado debe ser PENDIENTE, EN_PROGRESO o COMPLETADA");
        }
        task.setTitle(task.getTitle().trim());
        task.setStatus(task.getStatus().trim().toUpperCase());
    }
}