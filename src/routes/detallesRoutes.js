import { Router } from "express";
import {
  crearDetalles,
  obtenerMisDetalles,
  actualizarMisDetalles,
  listarDetalles,
  eliminarDetalle,
  obtenerDetallesPorUsuario
} from "../controladores/detallesCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

// ============================
// 👤 CLIENTE AUTENTICADO
// ============================
router.post("/detalles", verificarToken, crearDetalles);
router.get("/detalles/misdatos", verificarToken, obtenerMisDetalles);
router.put("/detalles/misdatos", verificarToken, actualizarMisDetalles);

// ============================
// 👑 ADMINISTRADOR
// ============================
// 👑 ADMINISTRADOR
router.get("/detalles/usuario/:user_id", verificarToken, verificarRolAdmin, obtenerDetallesPorUsuario);
router.get("/detalles", verificarToken, verificarRolAdmin, listarDetalles);
router.delete("/detalles/:detalle_id", verificarToken, verificarRolAdmin, eliminarDetalle);

export default router;
