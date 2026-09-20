package com.cesde.aivastudio.repository;

import com.cesde.aivastudio.model.RenderVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RenderVideoRepository extends JpaRepository<RenderVideo, Long> {
    List<RenderVideo> findByUsuarioEmailAndFechaSolicitudAfter(String usuarioEmail, LocalDateTime fecha);
}