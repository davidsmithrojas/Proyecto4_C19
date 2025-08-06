const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "🏨 API de Reservas Hotel Paraíso",
      version: "1.0.0",
      description: `
      **Sistema de Gestión de Reservas para Hotel Paraíso**
      
      Esta API REST permite gestionar de forma completa las reservas del hotel, incluyendo:
      
      📋 **Funcionalidades principales:**
      • Crear nuevas reservas con validación automática
      • Consultar reservas existentes con filtros avanzados
      • Actualizar información de reservas
      • Eliminar reservas del sistema
      
      🏠 **Tipos de habitación disponibles:**
      • **individual** - Una cama individual (1 huésped)
      • **doble** - Una cama doble (1-2 huéspedes)
      • **triple** - Tres camas individuales (1-3 huéspedes)
      • **suite** - Suite de lujo (1-4 huéspedes)
      
      📅 **Estados de reserva:**
      • **pendiente** - Reserva creada, esperando confirmación
      • **confirmada** - Reserva confirmada por el hotel
      • **cancelada** - Reserva cancelada
      • **completada** - Estadía finalizada
      
      ⚠️ **Validaciones importantes:**
      • Las fechas deben estar en formato YYYY-MM-DD
      • La fecha de inicio debe ser anterior a la fecha de fin
      • No se permiten fechas en el pasado
      • El número de huéspedes debe coincidir con la capacidad de la habitación
      `
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
          summary: "✅ Crear Nueva Reserva",
          description: `
          **Crea una nueva reserva en el sistema del hotel**
          
          Este endpoint permite registrar una nueva reserva con todos los detalles necesarios. 
          El sistema automáticamente:
          • Genera un ID único para la reserva
          • Valida que las fechas sean coherentes
          • Verifica la capacidad de la habitación
          • Asigna estado "pendiente" por defecto
          
          **Proceso paso a paso:**
          1. Envía los datos de la reserva en el cuerpo de la petición
          2. El sistema valida la información
          3. Se genera automáticamente un ID único
          4. La reserva se guarda con estado "pendiente"
          5. Se retorna la reserva creada con su ID asignado
          `,
          tags: ["Gestión de Reservas"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hotel: { 
                      type: "string", 
                      example: "Hotel Paraíso",
                      description: "Nombre del hotel (actualmente solo 'Hotel Paraíso')"
                    },
                    tipo_habitacion: { 
                      type: "string", 
                      example: "doble",
                      enum: ["individual", "doble", "triple", "suite"],
                      description: "Tipo de habitación solicitada"
                    },
                    num_huespedes: { 
                      type: "integer", 
                      example: 2,
                      minimum: 1,
                      maximum: 4,
                      description: "Número de huéspedes (debe coincidir con capacidad de habitación)"
                    },
                    fecha_inicio: { 
                      type: "string", 
                      format: "date", 
                      example: "2025-08-15",
                      description: "Fecha de inicio de la reserva (formato: YYYY-MM-DD)"
                    },
                    fecha_fin: { 
                      type: "string", 
                      format: "date", 
                      example: "2025-08-20",
                      description: "Fecha de fin de la reserva (formato: YYYY-MM-DD)"
                    },
                    estado: { 
                      type: "string", 
                      example: "pendiente",
                      enum: ["pendiente", "confirmada", "cancelada", "completada"],
                      description: "Estado de la reserva (opcional, por defecto: 'pendiente')"
                    }
                  },
                  required: ["hotel", "tipo_habitacion", "num_huespedes", "fecha_inicio", "fecha_fin"],
                },
                examples: {
                  reserva_doble: {
                    summary: "Reserva habitación doble",
                    value: {
                      hotel: "Hotel Paraíso",
                      tipo_habitacion: "doble",
                      num_huespedes: 2,
                      fecha_inicio: "2025-08-15",
                      fecha_fin: "2025-08-20"
                    }
                  },
                  reserva_suite: {
                    summary: "Reserva suite familiar",
                    value: {
                      hotel: "Hotel Paraíso",
                      tipo_habitacion: "suite",
                      num_huespedes: 4,
                      fecha_inicio: "2025-12-24",
                      fecha_fin: "2025-12-31",
                      estado: "confirmada"
                    }
                  }
                }
              },
            },
          },
          responses: {
            "201": {
              description: "✅ Reserva creada exitosamente",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Reserva" },
                  examples: {
                    reserva_creada: {
                      summary: "Ejemplo de reserva creada",
                      value: {
                        id: 15,
                        hotel: "Hotel Paraíso",
                        tipo_habitacion: "doble",
                        num_huespedes: 2,
                        fecha_inicio: "2025-08-15",
                        fecha_fin: "2025-08-20",
                        estado: "pendiente"
                      }
                    }
                  }
                },
              },
            },
            "400": {
              description: "❌ Error en los datos enviados",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    fechas_invalidas: {
                      summary: "Fechas inválidas",
                      value: {
                        error: "La fecha de inicio debe ser anterior a la fecha de fin"
                      }
                    },
                    huespedes_excedidos: {
                      summary: "Capacidad excedida",
                      value: {
                        error: "Número de huéspedes excede la capacidad de la habitación individual (máximo 1)"
                      }
                    }
                  }
                }
              }
            },
            "500": { 
              description: "❌ Error interno del servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    error_servidor: {
                      summary: "Error del sistema",
                      value: {
                        error: "Error al Crear la Reserva"
                      }
                    }
                  }
                }
              }
            },
          },
        },
        get: {
          summary: "📋 Obtener Lista de Reservas",
          description: `
          **Consulta reservas con filtros opcionales**
          
          Este endpoint permite obtener todas las reservas del sistema o filtrarlas según diferentes criterios.
          Es muy útil para:
          • Ver todas las reservas del hotel
          • Buscar reservas por fechas específicas
          • Filtrar por tipo de habitación o estado
          • Encontrar reservas de un número específico de huéspedes
          
          **Cómo usar los filtros:**
          • Sin parámetros: devuelve TODAS las reservas
          • Con fecha_inicio y fecha_fin: busca reservas que se solapen con ese período
          • Los demás filtros se pueden combinar libremente
          
          **Ejemplo de búsqueda:** 
          Para encontrar habitaciones dobles disponibles en agosto de 2025:
          \`/api/reservas?tipo_habitacion=doble&fecha_inicio=2025-08-01&fecha_fin=2025-08-31&estado=confirmada\`
          `,
          tags: ["Consulta de Reservas"],
          parameters: [
            {
              name: "hotel",
              in: "query",
              schema: { type: "string", example: "Hotel Paraíso" },
              description: "🏨 Filtrar por nombre específico del hotel",
            },
            {
              name: "fecha_inicio",
              in: "query",
              schema: { type: "string", format: "date", example: "2025-08-01" },
              description: "📅 Fecha inicio del período a consultar (formato: YYYY-MM-DD). Se usa junto con fecha_fin para buscar reservas que se solapen con este período.",
            },
            {
              name: "fecha_fin",
              in: "query",
              schema: { type: "string", format: "date", example: "2025-08-31" },
              description: "📅 Fecha fin del período a consultar (formato: YYYY-MM-DD). Debe usarse junto con fecha_inicio.",
            },
            {
              name: "tipo_habitacion",
              in: "query",
              schema: { 
                type: "string", 
                enum: ["individual", "doble", "triple", "suite"],
                example: "doble" 
              },
              description: "🛏️ Filtrar por tipo específico de habitación",
            },
            {
              name: "estado",
              in: "query",
              schema: { 
                type: "string",
                enum: ["pendiente", "confirmada", "cancelada", "completada"],
                example: "confirmada"
              },
              description: "📊 Filtrar por estado actual de la reserva",
            },
            {
              name: "num_huespedes",
              in: "query",
              schema: { type: "integer", minimum: 1, maximum: 4, example: 2 },
              description: "👥 Filtrar por número exacto de huéspedes",
            },
          ],
          responses: {
            "200": {
              description: "✅ Lista de reservas obtenida exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Reserva" },
                  },
                  examples: {
                    todas_las_reservas: {
                      summary: "Lista completa de reservas",
                      value: [
                        {
                          id: 1,
                          hotel: "Hotel Paraíso",
                          tipo_habitacion: "doble",
                          num_huespedes: 2,
                          fecha_inicio: "2025-08-15",
                          fecha_fin: "2025-08-20",
                          estado: "confirmada"
                        },
                        {
                          id: 2,
                          hotel: "Hotel Paraíso",
                          tipo_habitacion: "suite",
                          num_huespedes: 4,
                          fecha_inicio: "2025-08-22",
                          fecha_fin: "2025-08-25",
                          estado: "pendiente"
                        }
                      ]
                    },
                    reservas_filtradas: {
                      summary: "Reservas filtradas por tipo",
                      value: [
                        {
                          id: 3,
                          hotel: "Hotel Paraíso",
                          tipo_habitacion: "individual",
                          num_huespedes: 1,
                          fecha_inicio: "2025-08-10",
                          fecha_fin: "2025-08-12",
                          estado: "confirmada"
                        }
                      ]
                    },
                    sin_resultados: {
                      summary: "Sin reservas encontradas",
                      value: []
                    }
                  }
                },
              },
            },
            "500": { 
              description: "❌ Error interno del servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    error_consulta: {
                      summary: "Error al consultar reservas",
                      value: {
                        error: "Error al Obtener las Reservas"
                      }
                    }
                  }
                }
              }
            },
          },
        },
      },
      "/api/reservas/{id}": {
        get: {
          summary: "🔍 Obtener Reserva por ID",
          description: `
          **Consulta los detalles completos de una reserva específica**
          
          Este endpoint te permite obtener toda la información de una reserva usando su ID único.
          Es útil para:
          • Ver detalles completos de una reserva específica
          • Verificar el estado actual de una reserva
          • Obtener información antes de actualizar o eliminar
          
          **¿Cómo obtener el ID?**
          • Usa el endpoint GET /api/reservas para ver todas las reservas con sus IDs
          • El ID se genera automáticamente al crear una reserva
          • Es un número entero único e incremental
          `,
          tags: ["Consulta de Reservas"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer", example: 15 },
              description: "🆔 ID único de la reserva que deseas consultar",
            },
          ],
          responses: {
            "200": {
              description: "✅ Reserva encontrada exitosamente",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Reserva" },
                  examples: {
                    reserva_encontrada: {
                      summary: "Detalles de reserva específica",
                      value: {
                        id: 15,
                        hotel: "Hotel Paraíso",
                        tipo_habitacion: "suite",
                        num_huespedes: 3,
                        fecha_inicio: "2025-12-24",
                        fecha_fin: "2025-12-31",
                        estado: "confirmada"
                      }
                    }
                  }
                },
              },
            },
            "404": { 
              description: "❌ Reserva no encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    reserva_no_existe: {
                      summary: "ID no existe en el sistema",
                      value: {
                        error: "Reserva No Encontrada"
                      }
                    }
                  }
                }
              }
            },
            "500": { 
              description: "❌ Error interno del servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    error_servidor: {
                      summary: "Error del sistema",
                      value: {
                        error: "Error al Obtener la Reserva"
                      }
                    }
                  }
                }
              }
            },
          },
        },
        put: {
          summary: "✏️ Actualizar Reserva",
          description: `
          **Modifica los datos de una reserva existente**
          
          Este endpoint permite actualizar cualquier campo de una reserva específica.
          Características importantes:
          • Solo se modifican los campos que envíes en el cuerpo de la petición
          • Los campos no incluidos mantienen su valor original
          • El ID de la reserva nunca cambia
          • Se aplican las mismas validaciones que al crear una reserva
          
          **Casos de uso comunes:**
          • Cambiar fechas de la reserva
          • Actualizar el estado (pendiente → confirmada)
          • Modificar el número de huéspedes
          • Cambiar el tipo de habitación
          
          **⚠️ Validaciones:**
          • Las nuevas fechas deben ser coherentes
          • El número de huéspedes debe coincidir con la capacidad de la habitación
          • No se pueden modificar reservas completadas (opcional según reglas de negocio)
          `,
          tags: ["Gestión de Reservas"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer", example: 15 },
              description: "🆔 ID único de la reserva que deseas actualizar",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hotel: { 
                      type: "string",
                      example: "Hotel Paraíso",
                      description: "Nombre del hotel"
                    },
                    tipo_habitacion: { 
                      type: "string",
                      enum: ["individual", "doble", "triple", "suite"],
                      example: "suite",
                      description: "Nuevo tipo de habitación"
                    },
                    num_huespedes: { 
                      type: "integer",
                      minimum: 1,
                      maximum: 4,
                      example: 2,
                      description: "Nuevo número de huéspedes"
                    },
                    fecha_inicio: { 
                      type: "string", 
                      format: "date",
                      example: "2025-08-20",
                      description: "Nueva fecha de inicio"
                    },
                    fecha_fin: { 
                      type: "string", 
                      format: "date",
                      example: "2025-08-25",
                      description: "Nueva fecha de fin"
                    },
                    estado: { 
                      type: "string",
                      enum: ["pendiente", "confirmada", "cancelada", "completada"],
                      example: "confirmada",
                      description: "Nuevo estado de la reserva"
                    },
                  },
                },
                examples: {
                  confirmar_reserva: {
                    summary: "Confirmar una reserva pendiente",
                    value: {
                      estado: "confirmada"
                    }
                  },
                  cambiar_fechas: {
                    summary: "Modificar fechas de estancia",
                    value: {
                      fecha_inicio: "2025-08-20",
                      fecha_fin: "2025-08-25"
                    }
                  },
                  actualizar_completa: {
                    summary: "Actualización completa de reserva",
                    value: {
                      tipo_habitacion: "suite",
                      num_huespedes: 4,
                      fecha_inicio: "2025-12-24",
                      fecha_fin: "2025-12-31",
                      estado: "confirmada"
                    }
                  }
                }
              },
            },
          },
          responses: {
            "200": {
              description: "✅ Reserva actualizada exitosamente",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Reserva" },
                  examples: {
                    reserva_actualizada: {
                      summary: "Reserva después de actualización",
                      value: {
                        id: 15,
                        hotel: "Hotel Paraíso",
                        tipo_habitacion: "suite",
                        num_huespedes: 4,
                        fecha_inicio: "2025-12-24",
                        fecha_fin: "2025-12-31",
                        estado: "confirmada"
                      }
                    }
                  }
                },
              },
            },
            "400": {
              description: "❌ Error en los datos de actualización",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    fechas_incorrectas: {
                      summary: "Fechas inválidas",
                      value: {
                        error: "La fecha de inicio debe ser anterior a la fecha de fin"
                      }
                    }
                  }
                }
              }
            },
            "404": { 
              description: "❌ Reserva no encontrada para actualizar",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    reserva_inexistente: {
                      summary: "ID no existe",
                      value: {
                        error: "Reserva No Encontrada"
                      }
                    }
                  }
                }
              }
            },
            "500": { 
              description: "❌ Error interno del servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    error_actualizacion: {
                      summary: "Error del sistema",
                      value: {
                        error: "Error al Actualizar la Reserva"
                      }
                    }
                  }
                }
              }
            },
          },
        },
        delete: {
          summary: "🗑️ Eliminar Reserva",
          description: `
          **Elimina permanentemente una reserva del sistema**
          
          ⚠️ **OPERACIÓN IRREVERSIBLE**: Esta acción no se puede deshacer.
          
          Este endpoint elimina completamente una reserva del sistema usando su ID único.
          Recomendaciones de uso:
          • Verificar los detalles de la reserva antes de eliminar (usar GET /api/reservas/{id})
          • Considerar cambiar el estado a "cancelada" en lugar de eliminar (usar PUT)
          • Asegurarse de tener permisos adecuados para esta operación
          
          **Casos de uso típicos:**
          • Eliminar reservas duplicadas accidentalmente
          • Limpiar reservas de prueba del sistema
          • Remover reservas fraudulentas o incorrectas
          
          **Alternativa recomendada:**
          En lugar de eliminar, considera actualizar el estado a "cancelada" para mantener un historial.
          `,
          tags: ["Gestión de Reservas"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer", example: 15 },
              description: "🆔 ID único de la reserva que deseas eliminar permanentemente",
            },
          ],
          responses: {
            "200": { 
              description: "✅ Reserva eliminada correctamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                        example: "Reserva Eliminada Correctamente"
                      }
                    }
                  },
                  examples: {
                    eliminacion_exitosa: {
                      summary: "Confirmación de eliminación",
                      value: {
                        message: "Reserva Eliminada Correctamente"
                      }
                    }
                  }
                }
              }
            },
            "404": { 
              description: "❌ Reserva no encontrada para eliminar",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    reserva_no_existe: {
                      summary: "ID no existe en el sistema",
                      value: {
                        error: "Reserva No Encontrada"
                      }
                    }
                  }
                }
              }
            },
            "500": { 
              description: "❌ Error interno del servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                  examples: {
                    error_eliminacion: {
                      summary: "Error del sistema",
                      value: {
                        error: "Error al Eliminar la Reserva"
                      }
                    }
                  }
                }
              }
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Reserva: {
          type: "object",
          description: "Modelo completo de una reserva en el sistema del hotel",
          properties: {
            id: { 
              type: "integer", 
              example: 15,
              description: "🆔 Identificador único de la reserva (generado automáticamente)"
            },
            hotel: { 
              type: "string", 
              example: "Hotel Paraíso",
              description: "🏨 Nombre del hotel donde se realiza la reserva"
            },
            tipo_habitacion: { 
              type: "string", 
              example: "doble",
              enum: ["individual", "doble", "triple", "suite"],
              description: "🛏️ Tipo de habitación reservada:\n• individual: 1 huésped\n• doble: 1-2 huéspedes\n• triple: 1-3 huéspedes\n• suite: 1-4 huéspedes"
            },
            num_huespedes: { 
              type: "integer", 
              example: 2,
              minimum: 1,
              maximum: 4,
              description: "👥 Número total de huéspedes (debe coincidir con capacidad de habitación)"
            },
            fecha_inicio: { 
              type: "string", 
              format: "date", 
              example: "2025-08-15",
              description: "📅 Fecha de inicio de la reserva (formato: YYYY-MM-DD)"
            },
            fecha_fin: { 
              type: "string", 
              format: "date", 
              example: "2025-08-20",
              description: "📅 Fecha de fin de la reserva (formato: YYYY-MM-DD)"
            },
            estado: { 
              type: "string", 
              example: "confirmada",
              enum: ["pendiente", "confirmada", "cancelada", "completada"],
              description: "📊 Estado actual de la reserva:\n• pendiente: Esperando confirmación\n• confirmada: Reserva confirmada\n• cancelada: Reserva cancelada\n• completada: Estadía finalizada"
            },
          },
          required: ["id", "hotel", "tipo_habitacion", "num_huespedes", "fecha_inicio", "fecha_fin", "estado"],
          example: {
            id: 15,
            hotel: "Hotel Paraíso",
            tipo_habitacion: "doble",
            num_huespedes: 2,
            fecha_inicio: "2025-08-15",
            fecha_fin: "2025-08-20",
            estado: "confirmada"
          }
        },
        Error: {
          type: "object",
          description: "Formato estándar para respuestas de error de la API",
          properties: {
            error: {
              type: "string",
              description: "📝 Mensaje descriptivo del error ocurrido",
              example: "Error al procesar la solicitud"
            }
          },
          required: ["error"],
          examples: {
            error_validacion: {
              summary: "Error de validación",
              value: {
                error: "La fecha de inicio debe ser anterior a la fecha de fin"
              }
            },
            error_no_encontrado: {
              summary: "Recurso no encontrado",
              value: {
                error: "Reserva No Encontrada"
              }
            },
            error_servidor: {
              summary: "Error interno",
              value: {
                error: "Error interno del servidor"
              }
            }
          }
        }
      },
      examples: {
        ReservaCompleta: {
          summary: "Ejemplo de reserva completa",
          description: "Reserva típica para una familia en suite",
          value: {
            id: 25,
            hotel: "Hotel Paraíso",
            tipo_habitacion: "suite",
            num_huespedes: 4,
            fecha_inicio: "2025-12-24",
            fecha_fin: "2025-12-31",
            estado: "confirmada"
          }
        },
        ReservaIndividual: {
          summary: "Reserva individual",
          description: "Reserva típica para una persona",
          value: {
            id: 26,
            hotel: "Hotel Paraíso",
            tipo_habitacion: "individual",
            num_huespedes: 1,
            fecha_inicio: "2025-09-10",
            fecha_fin: "2025-09-12",
            estado: "pendiente"
          }
        }
      }
    },
    tags: [
      {
        name: "Gestión de Reservas",
        description: "🛠️ Operaciones para crear, actualizar y eliminar reservas"
      },
      {
        name: "Consulta de Reservas", 
        description: "🔍 Operaciones para consultar y filtrar reservas existentes"
      }
    ],
  };
  
  export default swaggerDocument;