package com.cesde.aivastudio.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cesde.aivastudio.model.RenderVideo;
import com.cesde.aivastudio.service.GeneracionVideoService;

@RestController
@RequestMapping("/api/videos")
public class GeneracionVideoController {

    private final GeneracionVideoService generacionVideoService;

    public GeneracionVideoController(GeneracionVideoService generacionVideoService) {
        this.generacionVideoService = generacionVideoService;
    }

    @PostMapping("/generar")
    public ResponseEntity<RenderVideo> solicitarVideo(
            @RequestBody RenderVideo solicitud,
            @RequestParam Long plantillaId) {
        RenderVideo render = generacionVideoService.validarLímiteYGenerar(solicitud, plantillaId);
        return new ResponseEntity<>(render, HttpStatus.CREATED);
    }
}