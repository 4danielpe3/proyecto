import { Router } from "express";
import {
  crearSolicitud,
  listarSolicitudes,
  listarMisSolicitudes,
  obtenerSolicitud,
  actualizarEstado,
  eliminarSolicitud,
  actualizarMotivo
} from "../controladores/solicitudesCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

router.post("/solicitudes", verificarToken, crearSolicitud);
router.get("/solicitudes", verificarToken, verificarRolAdmin, listarSolicitudes);
router.get("/solicitudes/mis-solicitudes", verificarToken, listarMisSolicitudes);
router.get("/solicitudes/:id", verificarToken, obtenerSolicitud);
router.put("/solicitudes/:id/motivo", verificarToken, actualizarMotivo);
router.put("/solicitudes/:id", verificarToken, verificarRolAdmin,actualizarEstado);
router.delete("/solicitudes/:id", verificarToken, eliminarSolicitud);

export default router;
