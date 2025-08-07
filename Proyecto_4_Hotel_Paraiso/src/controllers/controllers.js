import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'datejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../data/reservas.json');

// Constantes para validaciones
const TIPOS_HABITACION_VALIDOS = ['individual', 'doble', 'triple', 'suite'];
const ESTADOS_VALIDOS = ['pendiente', 'confirmada', 'cancelada', 'completada'];
const CAPACIDADES_HABITACION = {
  individual: { min: 1, max: 1 },
  doble: { min: 1, max: 2 },
  triple: { min: 1, max: 3 },
  suite: { min: 1, max: 4 }
};

// Funciones de validación
const validarFecha = (fecha) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) {
    return false;
  }
  const fechaObj = new Date(fecha);
  return fechaObj instanceof Date && !isNaN(fechaObj) && fecha === fechaObj.toISOString().split('T')[0];
};

const validarFechasCoherentes = (fecha_inicio, fecha_fin) => {
  const inicio = new Date(fecha_inicio);
  const fin = new Date(fecha_fin);
  return inicio < fin;
};

const validarFechaNoEnPasado = (fecha) => {
  const fechaObj = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Establecer a medianoche para comparar solo fechas
  return fechaObj >= hoy;
};

const validarTipoHabitacion = (tipo) => {
  return TIPOS_HABITACION_VALIDOS.includes(tipo);
};

const validarEstado = (estado) => {
  return ESTADOS_VALIDOS.includes(estado);
};

const validarCapacidadHabitacion = (tipo_habitacion, num_huespedes) => {
  const capacidad = CAPACIDADES_HABITACION[tipo_habitacion];
  if (!capacidad) return false;
  return num_huespedes >= capacidad.min && num_huespedes <= capacidad.max;
};

const validarDatosReserva = (datos, esCreacion = true) => {
  const errores = [];

  // Validaciones obligatorias para creación
  if (esCreacion) {
    if (!datos.hotel || datos.hotel.trim() === '') {
      errores.push('El campo hotel es obligatorio');
    }
    if (!datos.fecha_inicio) {
      errores.push('La fecha de inicio es obligatoria');
    }
    if (!datos.fecha_fin) {
      errores.push('La fecha de fin es obligatoria');
    }
    if (!datos.tipo_habitacion) {
      errores.push('El tipo de habitación es obligatorio');
    }
    if (!datos.num_huespedes) {
      errores.push('El número de huéspedes es obligatorio');
    }
  }

  // Validación de fechas
  if (datos.fecha_inicio && !validarFecha(datos.fecha_inicio)) {
    errores.push('La fecha de inicio debe tener el formato YYYY-MM-DD');
  }
  if (datos.fecha_fin && !validarFecha(datos.fecha_fin)) {
    errores.push('La fecha de fin debe tener el formato YYYY-MM-DD');
  }

  // Validación de coherencia de fechas
  if (datos.fecha_inicio && datos.fecha_fin && validarFecha(datos.fecha_inicio) && validarFecha(datos.fecha_fin)) {
    if (!validarFechasCoherentes(datos.fecha_inicio, datos.fecha_fin)) {
      errores.push('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    
    // Solo validar fechas no en pasado para creación o cuando se actualicen fechas
    if (esCreacion || datos.fecha_inicio) {
      if (!validarFechaNoEnPasado(datos.fecha_inicio)) {
        errores.push('La fecha de inicio no puede ser en el pasado');
      }
    }
  }

  // Validación de tipo de habitación
  if (datos.tipo_habitacion && !validarTipoHabitacion(datos.tipo_habitacion)) {
    errores.push(`El tipo de habitación debe ser uno de: ${TIPOS_HABITACION_VALIDOS.join(', ')}`);
  }

  // Validación de estado
  if (datos.estado && !validarEstado(datos.estado)) {
    errores.push(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`);
  }

  // Validación de número de huéspedes
  if (datos.num_huespedes) {
    if (!Number.isInteger(datos.num_huespedes) || datos.num_huespedes < 1) {
      errores.push('El número de huéspedes debe ser un número entero mayor a 0');
    } else if (datos.num_huespedes > 4) {
      errores.push('El número máximo de huéspedes es 4');
    }
  }

  // Validación de capacidad según tipo de habitación
  if (datos.tipo_habitacion && datos.num_huespedes && validarTipoHabitacion(datos.tipo_habitacion)) {
    if (!validarCapacidadHabitacion(datos.tipo_habitacion, datos.num_huespedes)) {
      const capacidad = CAPACIDADES_HABITACION[datos.tipo_habitacion];
      errores.push(`El número de huéspedes para habitación ${datos.tipo_habitacion} debe estar entre ${capacidad.min} y ${capacidad.max}`);
    }
  }

  return errores;
};

// Repository class para manejar el acceso a datos
class ReservaRepository {
  constructor() {
    this.filePath = filePath;
  }

  // Leer reservas del archivo JSON
  async leerReservas() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  // Guardar reservas en el archivo
  async guardarReservas(reservas) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(reservas, null, 2));
    } catch (err) {
      console.error('Error al Guardar las Reservas:', err);
      throw err;
    }
  }

  // Obtener todas las reservas
  async findAll() {
    return await this.leerReservas();
  }

  // Obtener reserva por ID
  async findById(id) {
    const reservas = await this.leerReservas();
    return reservas.find((r) => r.id == id);
  }

// Crear nueva reserva
  async create(reservaData) {
    const reservas = await this.leerReservas();
    const ultimoId = reservas.length > 0 ? reservas[reservas.length - 1].id : 0;
    
    const nuevaReserva = {
      id: parseInt(ultimoId) + 1,
      hotel: reservaData.hotel,
      fecha_inicio: reservaData.fecha_inicio,
      fecha_fin: reservaData.fecha_fin,
      tipo_habitacion: reservaData.tipo_habitacion,
      estado: reservaData.estado || 'pendiente',
      num_huespedes: reservaData.num_huespedes,
    };

    reservas.push(nuevaReserva);
    await this.guardarReservas(reservas);
    return nuevaReserva;
  }

  // Actualizar reserva existente
  async update(id, reservaData) {
    const reservas = await this.leerReservas();
    const index = reservas.findIndex((r) => r.id == id);
    
    if (index === -1) {
      return null;
    }

    reservas[index] = { ...reservas[index], ...reservaData };
    await this.guardarReservas(reservas);
    return reservas[index];
  }
  
// Eliminar reserva
  async delete(id) {
    const reservas = await this.leerReservas();
    const index = reservas.findIndex((r) => r.id == id);
    
    if (index === -1) {
      return false;
    }

    reservas.splice(index, 1);
    await this.guardarReservas(reservas);
    return true;
  }
}

// Instancia del repository
const reservaRepository = new ReservaRepository();

// Crear reserva
const crearReserva = async (req, res) => {
  try {
    // Validar datos de entrada
    const erroresValidacion = validarDatosReserva(req.body, true);
    if (erroresValidacion.length > 0) {
      return res.status(400).json({ 
        error: erroresValidacion.join('. ') 
      });
    }

    const nuevaReserva = await reservaRepository.create(req.body);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la reserva' });
  }
};

// Obtener todas las reservas con filtros
const obtenerReservas = async (req, res) => {
  try {
    let resultado = await reservaRepository.findAll();
    const {
      hotel,
      fecha_inicio,
      fecha_fin,
      tipo_habitacion,
      estado,
      num_huespedes,
    } = req.query;

  // Validar parámetros de filtro si se proporcionan
    if (tipo_habitacion && !validarTipoHabitacion(tipo_habitacion)) {
      return res.status(400).json({ 
        error: `Tipo de habitación inválido. Debe ser uno de: ${TIPOS_HABITACION_VALIDOS.join(', ')}` 
      });
    }

    if (estado && !validarEstado(estado)) {
      return res.status(400).json({ 
        error: `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` 
      });
    }

    if (fecha_inicio && !validarFecha(fecha_inicio)) {
      return res.status(400).json({ 
        error: 'La fecha de inicio debe tener el formato YYYY-MM-DD' 
      });
    }

    if (fecha_fin && !validarFecha(fecha_fin)) {
      return res.status(400).json({ 
        error: 'La fecha de fin debe tener el formato YYYY-MM-DD' 
      });
    }

    if (fecha_inicio && fecha_fin && !validarFechasCoherentes(fecha_inicio, fecha_fin)) {
      return res.status(400).json({ 
        error: 'La fecha de inicio debe ser anterior a la fecha de fin' 
      });
    }

    if (num_huespedes && (!Number.isInteger(parseInt(num_huespedes)) || parseInt(num_huespedes) < 1 || parseInt(num_huespedes) > 4)) {
      return res.status(400).json({ 
        error: 'El número de huéspedes debe ser un entero entre 1 y 4' 
      });
    }

    // Filtrar reservas según los parámetros de consulta
    if (hotel) resultado = resultado.filter((r) => r.hotel === hotel);
    if (tipo_habitacion)
      resultado = resultado.filter(
        (r) => r.tipo_habitacion === tipo_habitacion
      );
    if (estado) resultado = resultado.filter((r) => r.estado === estado);
    if (num_huespedes)
      resultado = resultado.filter((r) => r.num_huespedes == num_huespedes);

    //fecha_inicio y fecha_fin son obligatorios
    if (fecha_inicio && fecha_fin) {
      const inicioConsulta = Date.parse(fecha_inicio);
      const finConsulta = Date.parse(fecha_fin);

      resultado = resultado.filter((r) => {
        const inicioReserva = Date.parse(r.fecha_inicio);
        const finReserva = Date.parse(r.fecha_fin);

        return inicioReserva <= finConsulta && finReserva >= inicioConsulta;
      });
    }

    res.json(resultado);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return res.status(500).json({ error: 'Error interno del servidor al obtener las reservas' });
  }
};

// Obtener reserva por ID
const obtenerReservaPorId = async (req, res) => {
  try {
    // Validar que el ID sea un número válido
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ 
        error: 'El ID debe ser un número entero positivo' 
      });
    }

    const reserva = await reservaRepository.findById(id);
    if (!reserva)
      return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(reserva);
  } catch (error) {
    console.error('Error al obtener reserva por ID:', error);
    return res.status(500).json({ error: 'Error interno del servidor al obtener la reserva' });
  }
};
