AIVA Studio
# Proyecto realizado por:
- Gndris Alberto Urbina Urbina.
- Ariel de la Rosa Reales.
- Victoria Belen Valero.
- Yeison Arbey García Mesa.

Frontend de un estudio para preparar y administrar solicitudes de generación de videos con IA. La interfaz está construida con React 19 y Vite y consume la API Spring Boot de AIVA Studio (aiva-studio-api).

Estado del proyecto: las solicitudes de video se guardan en cola y descuentan créditos de forma transaccional, pero todavía no se genera ningún video: falta conectar un proveedor externo de generación. Las recargas de créditos son de prueba y no procesan pagos reales.

Contenido
Funcionalidades
Tecnologías
Requisitos
Inicio rápido
Variables de entorno
Scripts disponibles
Estructura del proyecto
Rutas de la aplicación
Conexión con el backend
Reglas de negocio
Flujos clave
Seguridad
Solución de problemas
Actualizaciones recientes
Limitaciones conocidas y próximos pasos
Proyecto de referencia
Funcionalidades
Acceso y cuenta
Registro e inicio de sesión conectados con la API. Las pantallas de acceso se muestran limpias, sin menús de navegación.
Recuperación de contraseña por correo: enlace de un solo uso que vence a los 30 minutos (ver flujo).
Cierre de sesión con confirmación, disponible en el botón "Salir" del encabezado y en la barra lateral.
Menú de usuario en el encabezado, con opciones para editar la cuenta (nombre, correo y cambio opcional de contraseña) y abrir las preferencias.
Si el token expira, la sesión local se limpia y se vuelve al inicio de sesión. Si ya hay una sesión activa, la raíz (/) lleva directamente al estudio.
Estudio
Inicio con saldo de créditos, métricas de proyectos y actividad reciente.
Flujo guiado de tres pasos para crear un video: brief y prompt, modelo y formato, revisión y envío.
Catálogo de modelos de IA con costos por segundo, consultado desde la API.
Biblioteca de proyectos con búsqueda, filtros por estado y ventana de detalles.
Eliminación de proyectos en cualquier estado, con confirmación previa.
Menú del espacio de trabajo en la barra lateral: "Inicio" y "Modelos IA" quedan fijos, y "Crear video", "Mis proyectos" y "Créditos" se agrupan en un menú desplegable.
Créditos
Saldo, historial de movimientos persistido y registro de recargas de prueba.
Cálculo automático del costo de cada render y del bono por recarga (ver reglas de negocio).
Experiencia de uso
Diseño adaptable a pantallas pequeñas, con barra de navegación móvil.
Avisos flotantes (toasts) y ventanas de confirmación con SweetAlert2.
Los errores de red o de validación se muestran al usuario: nunca se confirma una operación que el servidor no haya guardado.
Tecnologías
Capa	Tecnología
Interfaz	React 19, React Router 7
Build y servidor de desarrollo	Vite 8
Estilos	Tailwind CSS 4 (plugin de Vite) y CSS propio en src/components/studio-workspace.css
Avisos y confirmaciones	SweetAlert2
Calidad de código	ESLint 10 con reglas de React Hooks
Backend (repositorio aparte)	Spring Boot 4, Java 17, JPA/Hibernate, PostgreSQL, Swagger UI
Requisitos
Node.js 20.19 o superior (se recomienda la versión LTS vigente) y npm.
El backend aiva-studio-api en ejecución. Necesita Java 17 y una base de datos PostgreSQL.
Inicio rápido
1. Levantar el backend
bash
cd aiva-studio-api
cp .env.template .env      # completa DB_URL, DB_USERNAME y DB_PASSWORD
./mvnw spring-boot:run
La API queda en http://localhost:8080 y la documentación interactiva en http://localhost:8080/swagger-ui.html. Las tablas se crean solas en el primer arranque (ddl-auto=update) y se precarga un catálogo inicial de modelos de IA.

2. Levantar el frontend
bash
cd AIVA-Studio
npm install
cp .env.example .env
npm run dev
Abre http://localhost:5173. También puedes usar npm start, que expone Vite en toda la red local (--host 0.0.0.0).

3. Probar el flujo completo
Crea una cuenta en /registro. Cada cuenta nueva recibe 100 créditos iniciales.
Inicia sesión: entrarás al estudio en /workspace.
Pulsa Nuevo video, completa los tres pasos y envía la solicitud. Se descontarán los créditos y el proyecto aparecerá "En cola".
Variables de entorno
Frontend (.env)
Variable	Descripción	Valor por defecto
VITE_API_URL	URL base de la API, incluyendo /api	http://localhost:8080/api
Vite lee las variables al arrancar: reinícialo después de cambiar .env. El archivo .env está en .gitignore; no lo subas al repositorio.

Backend (.env en aiva-studio-api)
Variable	Descripción	Obligatoria
DB_URL	URL JDBC de PostgreSQL (jdbc:postgresql://host:5432/base)	Sí
DB_USERNAME / DB_PASSWORD	Credenciales de la base de datos	Sí
PORT	Puerto de la API	No (8080)
app.cors.allowed-origins	Orígenes permitidos, separados por coma	No (http://localhost:5173)
FRONTEND_URL	URL pública del frontend; se usa para armar el enlace de recuperación	No (http://localhost:5173)
MAIL_FROM	Remitente de los correos	No (no-reply@aivastudio.com)
spring.mail.host, .port, .username, .password	Servidor SMTP para enviar correos reales	No (ver recuperación de contraseña)
Nota sobre CORS: .env.template menciona CORS_ORIGINS, pero el código lee la propiedad app.cors.allowed-origins (en el .env escríbela con ese nombre, o usa la variable de entorno APP_CORS_ALLOWED_ORIGINS). Si el navegador bloquea las peticiones por CORS, revisa este valor.

Scripts disponibles
Comando	Qué hace
npm run dev	Servidor de desarrollo con recarga en caliente
npm start	Igual que dev, pero accesible desde otros dispositivos de la red
npm run build	Genera la versión de producción en dist/
npm run preview	Sirve localmente la versión de dist/
npm run lint	Analiza el código con ESLint
Estructura del proyecto
AIVA-Studio/
├── index.html
├── vite.config.js
├── eslint.config.js
├── .env.example
└── src/
    ├── main.jsx                    # Punto de entrada, monta el router
    ├── index.css                   # Estilos globales (Tailwind)
    ├── routers/
    │   └── AppRouter.jsx           # Definición de rutas
    ├── components/
    │   ├── MainLayout.jsx          # Decide qué layout usa cada ruta
    │   ├── studio-workspace.css    # Estilos del estudio
    │   └── Header, Aside, Footer, Cards   # Layout y piezas heredadas de la portada
    ├── pages/
    │   ├── Login.jsx
    │   ├── Registro.jsx
    │   ├── RecuperarPassword.jsx   # Solicitud del enlace de recuperación
    │   ├── RestablecerPassword.jsx # Elegir la nueva contraseña
    │   ├── StudioWorkspace.jsx     # Estudio: inicio, proyectos, modelos, créditos, preferencias
    │   └── Home.jsx                # Panel anterior (ya no se enlaza desde el router)
    ├── api/
    │   ├── client.js               # Cliente HTTP: token, errores y manejo de 401
    │   ├── api.js                  # Fachada única `aivaApi` que usan las pantallas
    │   ├── authService.js          # Sesión, registro y recuperación de contraseña
    │   ├── usuarioService.js       # Perfil, edición de cuenta, créditos
    │   └── proyectoService.js      # Crear, listar y eliminar proyectos
    └── helpers/
        ├── businessRules.js        # Costos, bonos y validaciones de saldo
        └── aivaMappers.js          # Adapta las respuestas de la API a la interfaz
Las pantallas llaman siempre a aivaApi (en api.js). Para exponer un servicio nuevo, agrégalo primero en su archivo de servicio y después en esa fachada; si falta en la fachada, aparece el error aivaApi.<función> is not a function.

Rutas de la aplicación
Ruta	Pantalla	Requiere sesión
/	Redirige a /workspace	—
/login	Inicio de sesión	No
/registro	Registro	No
/recuperar-password	Solicitar enlace de recuperación	No
/restablecer-password?token=...	Elegir nueva contraseña	No (requiere el token del correo)
/workspace	Estudio (vista "Inicio")	Sí
/proyectos, /modelos, /creditos, /preferencias	Estudio, abierto en esa sección	Sí
cualquier otra	Redirige a /	—
Sin sesión, las rutas del estudio envían a /login. Las pantallas de acceso se dibujan sin encabezado, barra lateral ni pie de página.

Conexión con el backend
Endpoints que usa el frontend
Método y ruta	Uso	Sesión
POST /api/users	Registro	No
POST /api/sessions	Inicio de sesión (devuelve el token)	No
DELETE /api/sessions/current	Cierre de sesión (revoca el token)	Sí
GET /api/users/{id}	Perfil y saldo	Sí
PUT /api/users/{id}	Editar nombre y correo	Sí
PATCH /api/users/{id}/password	Cambiar contraseña	Sí
POST /api/password-resets	Solicitar enlace de recuperación	No
POST /api/password-resets/confirm	Guardar la nueva contraseña con el token	No
GET /api/ai-models	Catálogo de modelos	Sí
POST /api/projects	Crear solicitud de video (descuenta créditos)	Sí
GET /api/users/{id}/projects	Listar proyectos	Sí
DELETE /api/projects/{id}	Eliminar proyecto	Sí
GET /api/users/{id}/credits	Historial de movimientos	Sí
POST /api/users/{id}/credits	Recarga de prueba	Sí
La documentación completa, con la que puedes probar cada endpoint, está en Swagger: http://localhost:8080/swagger-ui.html.

Sesión
El inicio de sesión devuelve un token Bearer con vigencia de 12 horas.
Se guarda en localStorage con las claves aiva_token, aiva_user_id y aiva_user.
client.js agrega el encabezado Authorization a cada petición. Ante un 401 en una ruta protegida borra esas claves y emite el evento aiva:unauthorized, que el estudio usa para volver a /login.
Los endpoints de acceso (POST /users, POST /sessions) están exentos de ese borrado para que un error de credenciales no cierre la sesión.
Errores
La API responde con mensajes en español para validaciones y reglas de negocio (400), recursos inexistentes (404) y sesión inválida (401). El frontend muestra ese mensaje tal cual. Si el servidor no responde, se muestra un aviso de conexión.

Reglas de negocio
Regla	Detalle
Costo de un render	duración (segundos) × costo por segundo del modelo
Duraciones disponibles	5, 10, 15, 30, 45 y 60 segundos
Formatos	16:9 (horizontal), 9:16 (vertical), 1:1 (cuadrado)
Estilos visuales	Cinematográfico, Producto, Animación, Editorial, Realista
Créditos iniciales	100 al registrarse
Recarga mínima	50 créditos
Bono por recarga	+20 % si la recarga es de 500 créditos o más (se redondea hacia abajo)
Saldo insuficiente	No se permite enviar la solicitud
Contraseña	Entre 6 y 72 caracteres
Eliminar un proyecto	Permitido en cualquier estado. Los créditos ya usados no se devuelven y el historial de movimientos se conserva
Estados de un proyecto: En cola, Generando, Listo y Borrador (en la base de datos: EN_COLA, EN_PROCESO, COMPLETADO y BORRADOR). Como aún no hay proveedor de generación, los proyectos nuevos permanecen "En cola".

Flujos clave
Recuperación de contraseña
/login → "¿Olvidaste tu contraseña?" → /recuperar-password (escribe su correo)
   → el backend envía un correo con un enlace de un solo uso
      → /restablecer-password?token=... (elige la nueva contraseña)
         → vuelve a /login
La respuesta es idéntica exista o no el correo, para no revelar qué cuentas están registradas.
El token es aleatorio (256 bits); en la base de datos solo se guarda su hash SHA-256.
El enlace vence a los 30 minutos, es de un solo uso, y al pedir uno nuevo se invalidan los anteriores.
Hay un límite de una solicitud por minuto por cuenta.
Al guardar la nueva contraseña se cierran todas las sesiones abiertas de esa cuenta.
Modo desarrollo: si el backend no tiene SMTP configurado, el enlace no se envía por correo: se imprime en la consola del backend con el prefijo [DESARROLLO] SMTP no configurado. Cópialo completo en el navegador para continuar.

Correos reales: agrega al .env del backend, por ejemplo con Gmail (requiere verificación en dos pasos y una contraseña de aplicación):

properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=tu_correo@gmail.com
spring.mail.password=tu_clave_de_aplicacion
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
MAIL_FROM=tu_correo@gmail.com
FRONTEND_URL=http://localhost:5173
En producción, FRONTEND_URL debe ser la URL pública del frontend, porque con ella se construye el enlace del correo.

Edición de cuenta
Menú de usuario (encabezado) → Editar cuenta. Permite cambiar nombre y correo, y opcionalmente la contraseña (pide la actual). Si el correo ya pertenece a otra cuenta, se muestra el error dentro de la ventana. Una contraseña actual incorrecta devuelve un 400, no un 401, para no cerrar la sesión por error.

Eliminación de proyectos
Biblioteca de proyectos → abrir el detalle → Eliminar proyecto → confirmar. El backend solo elimina proyectos que pertenecen al usuario autenticado.

Seguridad
Las contraseñas se almacenan con hash; los tokens de sesión y de recuperación se guardan solo como hash.
Las rutas, salvo registro, inicio de sesión y recuperación, exigen token Bearer.
Un usuario solo puede consultar o modificar sus propios datos y proyectos.
Los archivos .env contienen credenciales: están ignorados por Git y no deben compartirse ni incluirse en archivos comprimidos.
Limitaciones actuales: el token vive en localStorage y no hay límite de intentos de inicio de sesión (ver próximos pasos).
Solución de problemas
Síntoma	Causa probable	Solución
Failed to resolve import ".../pages/..."	El archivo no existe o su nombre no coincide	Verifica el nombre exacto y que esté en src/pages/
aivaApi.<función> is not a function	La función no está expuesta en api.js	Agrégala en su servicio y en la fachada aivaApi
Swal is not defined	Falta el import de SweetAlert2	import Swal from 'sweetalert2' en el archivo que lo usa
<función> is not defined al cargar el estudio	Una función de StudioWorkspace se borró o quedó fuera del componente	Restaúrala dentro de StudioWorkspace, antes del if (!user)
La página carga y no hay datos	El backend está apagado o VITE_API_URL es incorrecta	Revisa que la API responda y reinicia Vite tras editar .env
Error de CORS en la consola	Origen del frontend no permitido	Ajusta app.cors.allowed-origins en el backend
El enlace de recuperación no llega	SMTP sin configurar, o límite de 1 solicitud por minuto	Busca Enlace de recuperación en la consola del backend; espera 60 s entre solicitudes
"El enlace de recuperación no es válido o ya expiró"	Venció (30 min), ya se usó o se pidió uno más reciente	Solicita un enlace nuevo
Error 405 o No static resource al llamar a un endpoint nuevo	El backend no se reinició con los cambios	Reinicia el backend
Un aviso no se ve	La barra de avisos de la página queda fuera de pantalla al hacer scroll	Usa los avisos flotantes (toast)
Actualizaciones recientes
Noviembre 2026

Interfaz

Botón Salir en el extremo superior derecho del encabezado, con confirmación.
Menú desplegable de usuario con Editar cuenta y Preferencias.
Menú del espacio de trabajo en la barra lateral, con Inicio y Modelos IA como accesos fijos.
Pantallas de acceso sin botones de navegación: solo el panel de login, registro o recuperación.
Enlace ¿Olvidaste tu contraseña? bajo el campo de contraseña.
La ruta / redirige al estudio, de modo que con sesión activa siempre se ve el panel nuevo.
Backend y datos

Nueva tabla password_reset_tokens (user_id, token_hash, expires_at, used_at, más las fechas de auditoría) para la recuperación de contraseña.
Nuevos endpoints: PUT /api/users/{id}, PATCH /api/users/{id}/password, DELETE /api/projects/{id}, POST /api/password-resets y POST /api/password-resets/confirm.
Dependencia spring-boot-starter-mail y @EnableAsync para el envío de correos en segundo plano.
Limitaciones conocidas y próximos pasos
Conectar un proveedor real de generación de video y actualizar los estados de los proyectos (hoy se quedan "En cola").
Integrar una pasarela de pagos para sustituir las recargas de prueba.
Valorar devolver créditos al eliminar proyectos que seguían "En cola".
Añadir límite de intentos al inicio de sesión y a la recuperación de contraseña.
Evaluar mover el token de sesión de localStorage a una cookie HttpOnly.
Retirar el código heredado (Home.jsx, Header, Aside, Footer) o reutilizarlo en una portada pública.
Las preferencias de render y las notificaciones aún no tienen endpoints.
Pruebas automatizadas del frontend y del backend.
Proyecto de referencia
El flujo retoma patrones de navegación, paneles de gestión, filtros y asistente de reserva del proyecto de referencia, traducidos al dominio de creación audiovisual.