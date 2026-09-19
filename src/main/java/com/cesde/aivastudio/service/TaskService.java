package com.cesde.aivastudio.service;

import com.cesde.aivastudio.model.Project;
import com.cesde.aivastudio.model.Task;
import com.cesde.aivastudio.repository.TaskRepository;
import java.util.List;
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
        project.addTask(task);
        return taskRepository.save(task);
    }
}