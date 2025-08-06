# 🏨 Reservas de Hotel

Este es un proyecto backend desarrollado con Node.js y Express para gestionar reservas de hotel, con funcionalidades CRUD completas. Las reservas se almacenan en un archivo JSON local.

## 📁 Estructura del Proyecto
```text
.
├── src/
│   ├── config/
│   │   └── swagger/
│   │       └── swagger.js          # Configuración de Swagger UI
│   ├── controllers/
│   │   └── controllers.js          # Lógica de negocio y controladores
│   ├── data/
│   │   └── reservas.json           # Base de datos JSON local
│   └── routes/
│       └── routes.js               # Definición de rutas de la API
├── .env                            # Variables de entorno
├── .gitignore
├── .prettierrc
├── Dockerfile                      # Configuración de Docker
├── docker-compose.yml              # Orquestación de Docker
├── package.json
├── package-lock.json
└── server.js                       # Punto de entrada de la aplicación
```

## 🐳 Instalación y Ejecución con Docker

### Prerrequisitos
- Docker Desktop instalado en tu sistema
- Git para clonar el repositorio

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone <url-del-repositorio>
cd Proyecto_4_Hotel_Paraiso
```

2. **Construir la imagen Docker:**
```bash
docker build -t hotel-paraiso-api .
```

3. **Ejecutar el contenedor:**
```bash
docker run -p 3000:3000 hotel-paraiso-api
```


## 🏗️ Arquitectura del Proyecto

### Patrón MVC (Model-View-Controller)
Este proyecto implementa una arquitectura MVC simplificada:

- **Model (Modelo):** Representado por `src/data/reservas.json` - almacena los datos
- **View (Vista):** Swagger UI en `/api-docs` - interfaz para interactuar con la API
- **Controller (Controlador):** `src/controllers/controllers.js` - maneja la lógica de negocio

### Ventajas de esta Arquitectura:
- **Separación de responsabilidades:** Cada componente tiene una función específica
- **Mantenibilidad:** Fácil de modificar y extender
- **Testabilidad:** Cada capa puede ser testeada independientemente
- **Escalabilidad:** Fácil agregar nuevas funcionalidades

### Patrón de Diseño Recomendado: Repository Pattern

Para mejorar la arquitectura actual, se recomienda implementar el **Repository Pattern**:

```javascript
// Ejemplo de implementación futura
class ReservaRepository {
  async findAll() { /* lógica de acceso a datos */ }
  async findById(id) { /* lógica de acceso a datos */ }
  async create(reserva) { /* lógica de acceso a datos */ }
  async update(id, reserva) { /* lógica de acceso a datos */ }
  async delete(id) { /* lógica de acceso a datos */ }
}
```

**¿Por qué Repository Pattern?**
- **Abstracción de datos:** Separa la lógica de acceso a datos
- **Testabilidad:** Fácil mockear para tests
- **Flexibilidad:** Cambiar de JSON a base de datos sin afectar controladores
- **Reutilización:** Misma lógica de acceso desde diferentes controladores

## 📚 Documentación con Swagger

### Acceso a Swagger UI
Una vez que el servidor esté corriendo, accede a:
```
http://localhost:3000/api-docs
```

### Cómo usar Swagger para probar la API

1. **Navegar a la documentación:** Abre `http://localhost:3000/api-docs`
2. **Explorar endpoints:** Verás todos los endpoints disponibles
3. **Probar endpoints:** Haz clic en "Try it out" para cada endpoint
4. **Ejecutar pruebas:** Haz clic en "Execute" para ver la respuesta

## 🧩 Endpoints de la API

### POST /api/reservas/
Crear una nueva reserva.

**Ejemplo de JSON para crear reserva:**
```json
{
  "hotel": "Hotel Paraíso",
  "tipo_habitacion": "doble",
  "num_huespedes": 3,
  "fecha_inicio": "2024-05-15",
  "fecha_fin": "2024-05-20",
  "estado": "pendiente"
}
```

### GET /api/reservas/
Obtener todas las reservas. Puedes aplicar filtros por query string:
- `hotel` - Filtrar por nombre de hotel
- `fecha_inicio` - Fecha de inicio para filtrar
- `fecha_fin` - Fecha de fin para filtrar
- `tipo_habitacion` - Filtrar por tipo de habitación
- `estado` - Filtrar por estado de la reserva
- `num_huespedes` - Filtrar por número de huéspedes

**Ejemplo de URL con filtros:**
```
GET /api/reservas?hotel=Hotel Paraíso&estado=pendiente&num_huespedes=2
```

### GET /api/reservas/:id
Obtener una reserva específica por ID.

**Ejemplo:**
```
GET /api/reservas/1
```

### PUT /api/reservas/:id
Actualizar una reserva existente por ID.

**Ejemplo de JSON para actualizar:**
```json
{
  "hotel": "Hotel Paraíso Actualizado",
  "tipo_habitacion": "suite",
  "num_huespedes": 4,
  "fecha_inicio": "2024-06-01",
  "fecha_fin": "2024-06-05",
  "estado": "confirmada"
}
```

### DELETE /api/reservas/:id
Eliminar una reserva por ID.

**Ejemplo:**
```
DELETE /api/reservas/1
```

## 📦 Estructura de Datos

### Objeto de Reserva
```json
{
  "id": 1,
  "hotel": "Hotel Nido de Condores",
  "fecha_inicio": "2024-12-24",
  "fecha_fin": "2024-12-30",
  "tipo_habitacion": "economica",
  "num_huespedes": 6,
  "estado": "pendiente"
}
```

### Campos Requeridos
- `hotel` (string): Nombre del hotel
- `tipo_habitacion` (string): Tipo de habitación
- `num_huespedes` (integer): Número de huéspedes
- `fecha_inicio` (date): Fecha de inicio de la reserva
- `fecha_fin` (date): Fecha de fin de la reserva

### Campos Opcionales
- `estado` (string): Estado de la reserva (por defecto: "pendiente")

## 🛠️ Tecnologías Utilizadas
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **Swagger UI** - Documentación interactiva de la API
- **dotenv** - Gestión de variables de entorno
- **fs/promises** - Operaciones de archivos asíncronas
- **datejs** - Manejo de fechas
- **Docker** - Contenedorización

## 🔧 Funcionalidades Implementadas

### ✅ Funcionalidades Actuales
- CRUD completo de reservas
- Filtros por múltiples criterios
- Documentación automática con Swagger
- Almacenamiento en JSON local
- Validación básica de datos
- Manejo de errores HTTP


## 📝 Notas Importantes

- **Proyecto Local:** Este es un proyecto de prueba para backend, sin autenticación
- **Almacenamiento:** Los datos se guardan en `src/data/reservas.json`
- **Puerto:** La aplicación corre en el puerto 3000 por defecto
- **Variables de Entorno:** Configurables en archivo `.env`

