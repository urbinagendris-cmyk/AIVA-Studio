package com.cesde.aivastudio.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "plantillas_video")
public class PlantillaVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String categoria; // Ej: "RESTAURANTES", "E_COMMERCE", "INMOBILIARIA"
    private Integer creditoCostoPorSegundo;
    private Boolean requiereSuscripcionPro;
    private String estado; // "ACTIVA", "DESACTIVADA"

    public PlantillaVideo() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getCreditoCostoPorSegundo() { return creditoCostoPorSegundo; }
    public void setCreditoCostoPorSegundo(Integer creditoCostoPorSegundo) { this.creditoCostoPorSegundo = creditoCostoPorSegundo; }

    public Boolean getRequiereSuscripcionPro() { return requiereSuscripcionPro; }
    public void setRequiereSuscripcionPro(Boolean requiereSuscripcionPro) { this.requiereSuscripcionPro = requiereSuscripcionPro; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}