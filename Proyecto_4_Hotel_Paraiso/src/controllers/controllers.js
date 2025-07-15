import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'datejs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, '../data/reservas.json');
/* let idCounter = 1; */

// Leer y guardar reservas en un archivo JSON
// Si el archivo no existe, se crea uno nuevo
const leerReservas = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

// Guardar reservas en el archivo
const guardarReservas = async (reservas) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(reservas, null, 2));
  } catch (err) {
    console.error('Error al Guardar las Reservas:', err);
  }
};

// Crear reserva
const crearReserva = async (req, res) => {
  try {
    const reservas = await leerReservas();
    const ultimoId = reservas.length > 0 ? reservas[reservas.length - 1].id : 0;
    const nuevaReserva = {
      id: parseInt(ultimoId) + 1, // Generar ID único
      hotel: req.body.hotel,
      fecha_inicio: req.body.fecha_inicio,
      fecha_fin: req.body.fecha_fin,
      tipo_habitacion: req.body.tipo_habitacion,
      estado: req.body.estado || 'pendiente',
      num_huespedes: req.body.num_huespedes,
    };

    reservas.push(nuevaReserva);
    await guardarReservas(reservas);
    res.status(201).json(nuevaReserva);
  } catch (error) {
    res.status(500).json({ error: 'Error al Crear la Reserva' });
  }
};

// Obtener todas las reservas con filtros
const obtenerReservas = async (req, res) => {
  try {
    let resultado = await leerReservas();
    const {
      hotel,
      fecha_inicio,
      fecha_fin,
      tipo_habitacion,
      estado,
      num_huespedes,
    } = req.query;

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
    return res.status(500).json({ error: 'Error al Obtener las Reservas' });
  }
};

// Obtener reserva por ID
const obtenerReservaPorId = async (req, res) => {
  try {
    const reservas = await leerReservas();
    const reserva = reservas.find((r) => r.id == req.params.id);
    if (!reserva)
      return res.status(404).json({ error: 'Reserva No Encontrada' });
    res.json(reserva);
  } catch (error) {
    return res.status(500).json({ error: 'Error al Obtener la Reserva' });
  }
};

// Actualizar reserva
const actualizarReserva = async (req, res) => {
  try {
    const reservas = await leerReservas();
    const index = reservas.findIndex((r) => r.id == req.params.id); //Solo 2 == para comparar valores, uno es string y otro es number
    if (index === -1)
      //viene con findindex, si no encuentra el elemento devuelve -1
      return res.status(404).json({ error: 'Reserva No Encontrada' });
    // Preservar ID original
    reservas[index] = { ...reservas[index], ...req.body };
    await guardarReservas(reservas);
    res.json(reservas[index]);
  } catch (error) {
    return res.status(500).json({ error: 'Error al Actualizar la Reserva' });
  }
};
// Eliminar reserva
const eliminarReserva = async (req, res) => {
  try {
    const reservas = await leerReservas();
    const index = reservas.findIndex((r) => r.id == req.params.id);
    if (index === -1)
      return res.status(404).json({ error: 'Reserva No Encontrada' });
    reservas.splice(index, 1);
    await guardarReservas(reservas);
    
    return res.status(200).json({ message: 'Reserva Eliminada Correctamente' });
  } catch (error) {
    return res.status(500).json({ error: 'Error al Eliminar la Reserva' });
  }
};
//Se exportan las funciones para ser utilizadas en las rutas
export {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva,
};
