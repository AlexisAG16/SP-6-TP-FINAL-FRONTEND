 # SP 6 TP FINAL - FRONTEND

## Descripción General
SPA desarrollada en React con Vite, TailwindCSS y React Router. Permite gestionar personajes y obras, favoritos por usuario, autenticación, feedback visual con Toastify y SweetAlert2, y diseño responsive.

## Estructura de Carpetas
- `src/`
	- `api/`: Lógica de comunicación con la API backend.
	- `components/`
		- `context/`: Contextos globales (auth, personajes, obras).
		- `pages/`: Vistas principales (login, registro, personajes, obras, etc).
		- `router/`: Rutas protegidas y navegación.
		- `ui/`: Componentes reutilizables (Navbar, Footer, Spinner, Modal de favoritos).
	- `hooks/`: Custom hooks (localStorage, tema).
	- `data/`: Datos estáticos de ejemplo.
	- `index.css`: Estilos globales con Tailwind.
	- `main.jsx`: Punto de entrada de la app.

## Principales Funcionalidades
- **Autenticación**: Login y registro con feedback visual. Manejo de sesión con JWT y contextos.
- **Gestión de Personajes y Obras**: CRUD completo, paginación, búsqueda y filtrado.
- **Favoritos por usuario**: Cada usuario tiene su propia lista de favoritos persistente en localStorage.
- **Feedback visual**: Toastify para notificaciones y SweetAlert2 para confirmaciones. LoadingSpinner en operaciones asíncronas.
- **Responsive**: UI adaptable a dispositivos móviles y escritorio con Tailwind.
- **Roles**: Acceso a funciones de admin solo para usuarios con rol adecuado.

## Flujo de uso típico
1. El usuario se registra o inicia sesión.
2. Navega por personajes y obras, puede buscar, filtrar y ver detalles.
3. Puede agregar personajes a favoritos (solo visibles para su usuario).
4. Admin puede crear, editar o eliminar obras/personajes.
5. Todas las acciones muestran feedback visual inmediato.

## Scripts útiles
- `npm run dev`: Inicia el frontend en modo desarrollo.
- `npm run build`: Compila la app para producción.
- `npm run preview`: Previsualiza la build de producción.

## Enlace desplegado
https://personajessobrenaturales.netlify.app/

---

# Backend - SP 6 TP FINAL BACKEND

## Descripción General
Este backend es una API REST construida con Node.js, Express y MongoDB (Mongoose) para gestionar personajes y obras fantásticas. Incluye autenticación JWT, validaciones, control de acceso por roles y carga de datos desde una MockAPI externa.

## Estructura de Carpetas
- `server.mjs`: Punto de entrada principal del servidor Express.
- `config/`: Configuración de la base de datos.
- `controllers/`: Lógica de negocio para autenticación, obras y personajes.
- `middleware/`: Middlewares para autenticación y validaciones.
- `models/`: Modelos de Mongoose para usuarios, obras y personajes.
- `repository/`: Acceso a datos y lógica de persistencia.
- `routes/`: Definición de rutas para la API.
- `services/`: Lógica de negocio reutilizable.
- `utilities/`: Utilidades como carga desde MockAPI.

## Principales Funcionalidades
- **Autenticación y Autorización**: Registro, login y protección de rutas con JWT. Roles: usuario y admin.
- **CRUD de Obras y Personajes**: Crear, leer, actualizar y eliminar obras/personajes. Solo admin puede eliminar o editar obras.
- **Validaciones**: Validaciones de datos en middleware antes de llegar a los controladores.
- **Carga desde MockAPI**: Endpoint especial para importar obras desde una API externa solo una vez.
- **Mensajes de error claros**: Respuestas HTTP con mensajes útiles para el frontend.

## Flujo de una petición típica
1. El frontend realiza una petición (por ejemplo, crear personaje).
2. La petición pasa por middlewares de autenticación y validación.
3. El controlador procesa la lógica y llama a los servicios/repositorios.
4. El modelo de Mongoose interactúa con la base de datos.
5. Se responde al frontend con el resultado o error.

## Scripts útiles
- `npm run dev`: Inicia el servidor en modo desarrollo con nodemon.
- `npm start`: Inicia el servidor en modo producción.

---

# Detalle del Código (por partes)

## Backend
- **server.mjs**: Configura Express, conecta a MongoDB, monta rutas y middlewares globales.
- **controllers/**: Lógica de cada endpoint (ej: crear personaje, login, cargar obras desde MockAPI).
- **middleware/**: Verifica JWT, roles y valida datos antes de llegar al controlador.
- **models/**: Define los esquemas de usuario, obra y personaje.
- **repository/**: Acceso a la base de datos, consultas y persistencia.
- **services/**: Lógica de negocio reutilizable (ej: autenticación, carga de datos externos).
- **utilities/mockapi.loader.js**: Utilidad para importar datos desde MockAPI y poblar la base de datos local en desarrollo.

## Frontend
- **src/api/**: Axios para consumir la API backend (AuthApi.js, CharacterApi.js, ObrasApi.js).
- **src/components/context/**: Contextos globales para auth, personajes y obras. Manejan estado, lógica y exponen funciones a los componentes.
- **src/components/pages/**: Vistas principales. Cada una maneja su propio estado local y consume los contextos globales.
- **src/components/ui/**: Navbar, Footer, LoadingSpinner, FavoritesModal. Reutilizables y adaptativos.
- **src/components/router/**: Rutas protegidas y navegación centralizada.
- **src/hooks/**: Custom hooks para localStorage y tema (oscuro/claro).
- **Feedback visual**: Toastify y SweetAlert2 en todas las acciones importantes. LoadingSpinner en operaciones asíncronas.

---

# Notas finales
- El código está modularizado y documentado para facilitar su mantenimiento.
- Se recomienda revisar los archivos README y comentarios en el código para detalles de endpoints y props.
- Para dudas o mejoras, consultar la documentación interna o contactar al autor.