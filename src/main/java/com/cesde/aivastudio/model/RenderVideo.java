package com.cesde.aivastudio.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "renders_video")
public class RenderVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuarioEmail;
    private String planUsuario; // "FREE", "PRO", "ENTERPRISE"
    private Integer creditosDisponibles;

    @Column(length = 1000)
    private String prompt;

    private Integer duracionSegundos;
    private Integer creditosConsumidos;
    private LocalDateTime fechaSolicitud;
    private String estado; // "PROCESANDO", "COMPLETADO", "RECHAZADO"

    @ManyToOne
    @JoinColumn(name = "plantilla_id")
    private PlantillaVideo plantilla;

    public RenderVideo() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsuarioEmail() { return usuarioEmail; }
    public void setUsuarioEmail(String usuarioEmail) { this.usuarioEmail = usuarioEmail; }

    public String getPlanUsuario() { return planUsuario; }
    public void setPlanUsuario(String planUsuario) { this.planUsuario = planUsuario; }

    public Integer getCreditosDisponibles() { return creditosDisponibles; }
    public void setCreditosDisponibles(Integer creditosDisponibles) { this.creditosDisponibles = creditosDisponibles; }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public Integer getDuracionSegundos() { return duracionSegundos; }
    public void setDuracionSegundos(Integer duracionSegundos) { this.duracionSegundos = duracionSegundos; }

    public Integer getCreditosConsumidos() { return creditosConsumidos; }
    public void setCreditosConsumidos(Integer creditosConsumidos) { this.creditosConsumidos = creditosConsumidos; }

    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public PlantillaVideo getPlantilla() { return plantilla; }
    public void setPlantilla(PlantillaVideo plantilla) { this.plantilla = plantilla; }
}