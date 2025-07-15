const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "API de Reservas Hotel Paraiso",
    version: "1.0.0",
    description: "API REST para gestionar reservas de Hotel con CRUD y filtros",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor Local",
    },
  ],
  paths: {
    "/api/reservas": {
      post: {
        summary: "Crear una nueva reserva",
        description: "Permite crear una reserva en el hotel con los detalles especificados",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  hotel: { type: "string", example: "Hotel Paraíso" },
                  tipo_habitacion: { type: "string", example: "doble" },
                  num_huespedes: { type: "integer", example: 3 },
                  fecha_inicio: { type: "string", format: "date", example: "2023-05-15" },
                fecha_fin: { type: "string", format: "date", example: "2023-05-20" },
                  estado: { type: "string", example: "pendiente" },
                  // Puedes agregar más campos que uses en el body
                },
                required: ["hotel", "tipo_habitacion", "num_huespedes", "fecha_inicio", "fecha_fin"],
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Reserva creada con éxito",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Reserva" },
              },
            },
          },
          "500": { description: "Error interno del servidor" },
        },
      },
      get: {
        summary: "Obtener lista de reservas",
        description: "Obtiene todas las reservas o filtradas por parámetros opcionales",
        parameters: [
          {
            name: "hotel",
            in: "query",
            schema: { type: "string" },
            description: "Filtrar por nombre de hotel",
          },
          {
            name: "fecha_inicio",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Fecha inicio para filtrar reservas",
          },
          {
            name: "fecha_fin",
            in: "query",
            schema: { type: "string", format: "date" },
            description: "Fecha fin para filtrar reservas",
          },
          {
            name: "tipo_habitacion",
            in: "query",
            schema: { type: "string" },
            description: "Filtrar por tipo de habitación",
          },
          {
            name: "estado",
            in: "query",
            schema: { type: "string" },
            description: "Filtrar por estado de la reserva",
          },
          {
            name: "num_huespedes",
            in: "query",
            schema: { type: "integer" },
            description: "Filtrar por número de huéspedes",
          },
        ],
        responses: {
          "200": {
            description: "Lista de reservas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Reserva" },
                },
              },
            },
          },
          "500": { description: "Error interno del servidor" },
        },
      },
    },
    "/api/reservas/{id}": {
      get: {
        summary: "Obtener reserva por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID de la reserva",
          },
        ],
        responses: {
          "200": {
            description: "Detalle de la reserva",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Reserva" },
              },
            },
          },
          "404": { description: "Reserva no encontrada" },
          "500": { description: "Error interno del servidor" },
        },
      },
      put: {
        summary: "Actualizar Reserva",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID de la reserva a actualizar",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  hotel: { type: "string" },
                  tipo_habitacion: { type: "string" },
                  num_huespedes: { type: "integer" },
                  fecha_inicio: { type: "string", format: "date" },
                  fecha_fin: { type: "string", format: "date" },
                  estado: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Reserva actualizada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Reserva" },
              },
            },
          },
          "404": { description: "Reserva no encontrada" },
          "500": { description: "Error interno del servidor" },
        },
      },
      delete: {
        summary: "Eliminar reserva",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID de la reserva a eliminar",
          },
        ],
        responses: {
          "204": { description: "Reserva Eliminada Correctamente" },
          "404": { description: "Reserva No Encontrada" },
          "500": { description: "Error Interno del Servidor" },
        },
      },
    },
  },
  components: {
    schemas: {
      Reserva: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          hotel: { type: "string", example: "Hotel Paraíso" },
          tipo_habitacion: { type: "string", example: "doble" },
          num_huespedes: { type: "integer", example: 3 },
          fecha_inicio: { type: "string", format: "date", example: "2023-05-15" },
          fecha_fin: { type: "string", format: "date", example: "2023-06-15" },
          estado: { type: "string", example: "pendiente" },
        },
        required: ["id", "hotel", "tipo_habitacion", "num_huespedes", "fecha_inicio", "fecha_fin"],
      },
    },
  },
};

export default swaggerDocument;