import { Router } from "express";
import {
  crearSolicitud,
  listarSolicitudes,
  listarMisSolicitudes,
  obtenerSolicitud,
  actualizarEstado,
  eliminarSolicitud
} from "../controladores/solicitudesCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

// Crear solicitud
router.post("/solicitudes", verificarToken, crearSolicitud);

// Listar todas (admin)
router.get("/solicitudes", verificarToken, verificarRolAdmin, listarSolicitudes);

// Mis solicitudes
router.get("/solicitudes/mis-solicitudes", verificarToken, listarMisSolicitudes);

// Obtener una
router.get("/solicitudes/:id", verificarToken, obtenerSolicitud);

// Actualizar estado (admin)
router.put("/solicitudes/:id", verificarToken, verificarRolAdmin, actualizarEstado);

// Eliminar (admin)
router.delete("/solicitudes/:id", verificarToken, verificarRolAdmin, eliminarSolicitud);

export default router;
