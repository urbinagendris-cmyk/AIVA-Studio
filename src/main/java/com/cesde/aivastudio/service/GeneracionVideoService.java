package com.cesde.aivastudio.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cesde.aivastudio.exception.BusinessRuleException;
import com.cesde.aivastudio.model.PlantillaVideo;
import com.cesde.aivastudio.model.RenderVideo;
import com.cesde.aivastudio.repository.PlantillaVideoRepository;
import com.cesde.aivastudio.repository.RenderVideoRepository;

@Service
public class GeneracionVideoService {

    private final RenderVideoRepository renderVideoRepository;
    private final PlantillaVideoRepository plantillaVideoRepository;

    public GeneracionVideoService(RenderVideoRepository renderVideoRepository,
                                  PlantillaVideoRepository plantillaVideoRepository) {
        this.renderVideoRepository = renderVideoRepository;
        this.plantillaVideoRepository = plantillaVideoRepository;
    }

    private static final int LONGITUD_MINIMA_PROMPT = 20;
    private static final int DURACION_MAXIMA_PLAN_FREE = 15; // Segundos

    /**
     * REGLA DE NEGOCIO 1: Validación del Prompt, Restricción por Plan del Usuario y Cálculo de Créditos IA
     * 
     * - Evalúa: 
     *   1. La descripción/prompt ingresada por el usuario para generar el video publicitario debe tener al menos 20 caracteres.
     *   2. Si la plantilla seleccionada requiere suscripción PRO, los usuarios con plan 'FREE' no pueden usarla.
     *   3. Los usuarios con plan 'FREE' no pueden solicitar videos de más de 15 segundos.
     *   4. El usuario debe poseer créditos de IA suficientes para la duración solicitada.
     * - Fallo: Lanza BusinessRuleException (HTTP 400 Bad Request) si viola alguna restricción de plan o créditos.
     * - Éxito: Deduce los créditos consumidos, marca el video como 'PROCESANDO' y guarda el registro.
     */
    @Transactional
    public RenderVideo solicitarGeneracionVideo(RenderVideo solicitud, Long plantillaId) {
        // 1. Validar longitud del Prompt publicitario
        if (solicitud.getPrompt() == null || solicitud.getPrompt().trim().length() < LONGITUD_MINIMA_PROMPT) {
            throw new BusinessRuleException("El prompt para generar el video es muy corto. Debe incluir al menos " + 
                    LONGITUD_MINIMA_PROMPT + " caracteres detallando su campaña publicitaria.");
        }

        // 2. Buscar plantilla seleccionada
        PlantillaVideo plantilla = plantillaVideoRepository.findById(plantillaId)
                .orElseThrow(() -> new BusinessRuleException("La plantilla de video seleccionada no existe."));

        if (!"ACTIVA".equalsIgnoreCase(plantilla.getEstado())) {
            throw new BusinessRuleException("La plantilla seleccionada no se encuentra disponible actualmente.");
        }

        // 3. Validar permisos según Plan del usuario
        if (plantilla.getRequiereSuscripcionPro() && "FREE".equalsIgnoreCase(solicitud.getPlanUsuario())) {
            throw new BusinessRuleException("La plantilla '" + plantilla.getNombre() + "' requiere una suscripción PRO.");
        }

        if ("FREE".equalsIgnoreCase(solicitud.getPlanUsuario()) && solicitud.getDuracionSegundos() > DURACION_MAXIMA_PLAN_FREE) {
            throw new BusinessRuleException("El plan FREE solo permite generar videos publicitarios de máximo " + 
                    DURACION_MAXIMA_PLAN_FREE + " segundos.");
        }

        // 4. Calcular costo en créditos IA (Duración en Segundos * Costo de Crédito de la plantilla)
        int costoTotalCreditos = solicitud.getDuracionSegundos() * plantilla.getCreditoCostoPorSegundo();

        if (solicitud.getCreditosDisponibles() < costoTotalCreditos) {
            throw new BusinessRuleException("Créditos insuficientes. La generación requiere " + costoTotalCreditos + 
                    " créditos y solo dispone de " + solicitud.getCreditosDisponibles() + ".");
        }

        // Aplicar cambios
        solicitud.setPlantilla(plantilla);
        solicitud.setCreditosConsumidos(costoTotalCreditos);
        solicitud.setCreditosDisponibles(solicitud.getCreditosDisponibles() - costoTotalCreditos);
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setEstado("PROCESANDO");

        return renderVideoRepository.save(solicitud);
    }

    /**
     * REGLA DE NEGOCIO 2: Control Anti-Saturación de Renderizado (Límite de Generación Por Hora)
     * 
     * - Evalúa: 
     *   1. Evitar la saturación del servidor de IA limitando a un máximo de 3 solicitudes de renderizado por usuario en la última hora.
     * - Fallo: Lanza BusinessRuleException (HTTP 400 Bad Request) si el usuario excede la cuota horaria.
     * - Éxito: Procesa la solicitud y persiste el render del video publicitario.
     */
    @Transactional
    public RenderVideo validarLímiteYGenerar(RenderVideo solicitud, Long plantillaId) {
        LocalDateTime unaHoraAtras = LocalDateTime.now().minusHours(1);
        List<RenderVideo> rendersRecientes = renderVideoRepository
                .findByUsuarioEmailAndFechaSolicitudAfter(solicitud.getUsuarioEmail(), unaHoraAtras);

        if (rendersRecientes.size() >= 3) {
            throw new BusinessRuleException("Ha alcanzado el límite permitido de 3 videos generados por hora. " +
                    "Por favor espere unos minutos antes de solicitar un nuevo render.");
        }

        return solicitarGeneracionVideo(solicitud, plantillaId);
    }
}