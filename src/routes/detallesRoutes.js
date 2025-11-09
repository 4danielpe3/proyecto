import { Router } from "express";
import {
  crearDetalles,
  obtenerMisDetalles,
  actualizarMisDetalles,
  listarDetalles,
  eliminarDetalle
} from "../controladores/detallesCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

// ============================
// 👤 CLIENTE AUTENTICADO
// ============================
router.post("/detalles_usuario", verificarToken, crearDetalles);
router.get("/detalles/misdatos", verificarToken, obtenerMisDetalles);
router.put("/detalles/misdatos", verificarToken, actualizarMisDetalles);

// ============================
// 👑 ADMINISTRADOR
// ============================
router.get("/detalles", verificarToken, verificarRolAdmin, listarDetalles);
router.delete("/detalles/:detalle_id", verificarToken, verificarRolAdmin, eliminarDetalle);

export default router;
