import { Router } from "express";
import {
  crearRegistroVisita,
  listarRegistros,
  listarMisRegistros,
  eliminarRegistro,
  actualizarRegistros
} from "../controladores/registrosCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

// Crear registro (usuario autenticado con solicitud aceptada)
router.post("/registros", verificarToken, crearRegistroVisita);

router.post("/registros/actualizar", verificarToken, verificarRolAdmin, actualizarRegistros);
// Listar registros con solicitudes activas (admin)
router.get("/registros", verificarToken, verificarRolAdmin, listarRegistros);

// Listar mis registros (usuario autenticado)
router.get("/registros/mis-registros", verificarToken, listarMisRegistros);

// Eliminar registro (solo admin)
router.delete("/registros/:id", verificarToken, verificarRolAdmin, eliminarRegistro);

export default router;
