import { Router } from "express";
import {
  enviarMensaje,
  listarMensajes,
  listarMisMensajes,
  obtenerMensaje,
  eliminarMensaje
} from "../controladores/mensajeCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

// 🟢 Enviar mensaje (solo admin)
router.post("/mensajes", verificarToken, verificarRolAdmin, enviarMensaje);

// 🟡 Listar todos los mensajes (solo admin)
router.get("/mensajes", verificarToken, verificarRolAdmin, listarMensajes);

// 🟢 Listar mensajes del usuario autenticado
router.get("/mensajes/mis-mensajes", verificarToken, listarMisMensajes);

// 🔍 Obtener mensaje por ID (solo admin)
router.get("/mensajes/:id", verificarToken, verificarRolAdmin, obtenerMensaje);

// 🔴 Eliminar mensaje (solo admin)
router.delete("/mensajes/:id", verificarToken, verificarRolAdmin, eliminarMensaje);

export default router;
