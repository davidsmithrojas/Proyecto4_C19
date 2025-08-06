import express from "express";
const router = express.Router();
import {
  crearReserva,
  obtenerReservas,
  obtenerReservaPorId,
  actualizarReserva,
  eliminarReserva
} from "../controllers/controllers.js";

router.post("/", crearReserva);
router.get("/", obtenerReservas);
router.get("/:id", obtenerReservaPorId);
router.put("/:id", actualizarReserva);
router.delete("/:id", eliminarReserva);

export default router;