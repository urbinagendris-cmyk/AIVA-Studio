# React + Vite

## Reglas de negocio y pruebas en Postman

La API aplica las reglas en la capa `@Service`; los controladores solo reciben la petición y delegan.

### Regla 1: proyectos

`ProjectService` exige que el nombre del proyecto no esté vacío, tenga máximo 80 caracteres y no esté repetido.

Caso exitoso, `POST http://localhost:8080/api/projects`, respuesta `201 Created`:

```json
{
	"name": "Lanzamiento Aurora",
	"description": "Video promocional para redes"
}
```

Caso fallido, mismo endpoint, respuesta `400 Bad Request`:

```json
{
	"name": "   ",
	"description": "Proyecto sin nombre"
}
```

### Regla 2: tareas

`TaskService` exige un título de máximo 120 caracteres y limita el estado a `PENDIENTE`, `EN_PROGRESO` o `COMPLETADA`.

Caso exitoso, `POST http://localhost:8080/api/projects/{projectId}/tasks`, respuesta `201 Created`:

```json
{
	"title": "Escribir guion",
	"status": "PENDIENTE"
}
```

Caso fallido, mismo endpoint, respuesta `400 Bad Request`:

```json
{
	"title": "Escribir guion",
	"status": "FINALIZADA"
}
```

El error controlado tiene esta forma:

```json
{
	"status": 400,
	"error": "Bad Request",
	"message": "El estado debe ser PENDIENTE, EN_PROGRESO o COMPLETADA"
}
```

Las pruebas automatizadas equivalentes están en `BusinessRulesIntegrationTests` y se ejecutan con `./mvnw.cmd test`.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
