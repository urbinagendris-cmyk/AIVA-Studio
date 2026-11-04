# AIVA Studio

Frontend de un estudio para preparar y administrar solicitudes de generación de videos con IA. La interfaz está construida con React y Vite y consume la API Spring Boot de AIVA Studio.

## Experiencia incluida

- Registro e inicio de sesión conectados con la API.
- Resumen con saldo, actividad reciente y estados de generación.
- Flujo guiado de tres pasos: brief y prompt, modelo y formato, revisión y envío.
- Catálogo de modelos y costos consultados desde la API.
- Biblioteca de proyectos con búsqueda, filtros por estado y vista de detalles.
- Pantalla de créditos con historial persistido y registro de recargas de prueba.
- Diseño adaptable a pantallas pequeñas.

El flujo retoma patrones de navegación, paneles de gestión, filtros y asistente de reserva del [proyecto de referencia](https://github.com/jfinforecursos/backend2-proyecto-integrador-v1), traducidos al dominio de creación audiovisual. No se conservan entidades ni contenido médico.

## Ejecutar localmente

Requisitos: Node.js y npm.

```bash
npm install
cp .env.example .env
npm run dev
```

También puedes iniciar Vite con `npm start`. Tailwind CSS 4 se procesa mediante el plugin de Vite y los estilos globales se cargan desde `src/index.css`.

Comandos disponibles:

```bash
npm run lint
npm run build
npm run preview
```

## Conexión con el backend

El frontend consume el backend Spring Boot para registro e inicio de sesión, consulta del catálogo y perfil, creación/listado de proyectos y movimientos de créditos. Copia `.env.example` a `.env` y configura `VITE_API_URL` con la URL base de la API, incluyendo `/api`; por defecto usa `http://localhost:8080/api`. El backend debe permitir el origen del frontend mediante `FRONTEND_URL` (por defecto `http://localhost:5173`).

Levanta primero el backend y después inicia Vite con `npm run dev`. Vite lee las variables al arrancar, así que reinícialo después de cambiar `.env`. Los errores de red o de validación se muestran al usuario; no se confirma una operación que el servidor no haya guardado. Si el token expira, la sesión local se limpia y se vuelve al inicio de sesión.

El backend guarda solicitudes en cola y actualiza el saldo de forma transaccional. Las recargas son de prueba y no procesan pagos; tampoco se genera un video hasta conectar un proveedor externo.
## Nuevas Actualizacione

se agregan neuvos atributos