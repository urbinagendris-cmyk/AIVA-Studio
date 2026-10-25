# AIVA Studio

Frontend de un estudio para preparar y administrar solicitudes de generación de videos con IA. La interfaz está construida con React y Vite; el backend y la conexión con proveedores de generación se desarrollan por separado.

## Experiencia incluida

- Inicio de sesión de demostración y espacio de trabajo creativo.
- Resumen con saldo, actividad reciente y estados de generación.
- Flujo guiado de tres pasos: brief y prompt, modelo y formato, revisión y envío.
- Catálogo demostrativo de modelos con costo estimado por segundo.
- Biblioteca de proyectos con búsqueda, filtros por estado y vista de detalles.
- Pantalla de créditos con historial y simulación de recargas.
- Diseño adaptable a pantallas pequeñas.

El flujo retoma patrones de navegación, paneles de gestión, filtros y asistente de reserva del [proyecto de referencia](https://github.com/jfinforecursos/backend2-proyecto-integrador-v1), traducidos al dominio de creación audiovisual. No se conservan entidades ni contenido médico.

## Ejecutar localmente

Requisitos: Node.js y npm.

```bash
npm install
npm run dev
```

Comandos disponibles:

```bash
npm run lint
npm run build
npm run preview
```

## Modo frontend

El catálogo, los proyectos de ejemplo, la cola de generación y las recargas son datos de demostración en memoria. Se reinician al recargar la página. La interfaz puede llamar a los endpoints existentes de AIVA para crear proyectos y recargar créditos; si la API no está disponible, informa que el cambio quedó solo en la sesión actual.

Configura `VITE_API_URL` para apuntar el frontend a la API. Por defecto usa `http://localhost:8080/api`.

La solicitud de generación incluye actualmente los campos del contrato de proyecto disponible (`usuarioId`, `nombre`, `modeloIa`, `costoCreditos`, `duracionSeg`). El prompt, estilo y formato se administran en la interfaz; deberán añadirse al contrato del backend antes de persistirlos o enviarlos a un proveedor real. No se conecta ni se simula una generación de video real.
