package com.cesde.aivastudio;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import com.cesde.aivastudio.model.Project;
import com.cesde.aivastudio.repository.ProjectRepository;

@SpringBootTest
class BusinessRulesIntegrationTests {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ProjectRepository projectRepository;

    private MockMvc mockMvc;
    private Long projectId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        projectId = projectRepository.save(new Project("Proyecto base", "Proyecto para pruebas de tareas")).getId();
    }

    @Test
    void createsProjectWhenNameIsValid() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Video promocional\",\"description\":\"Campana de lanzamiento\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void rejectsProjectWhenNameIsBlank() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"   \",\"description\":\"Sin nombre\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createsTaskWhenStatusIsValid() throws Exception {
        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Escribir guion\",\"status\":\"PENDIENTE\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void rejectsTaskWhenStatusIsInvalid() throws Exception {
        mockMvc.perform(post("/api/projects/" + projectId + "/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Escribir guion\",\"status\":\"FINALIZADA\"}"))
                .andExpect(status().isBadRequest());
    }
}