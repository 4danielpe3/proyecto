import { Router } from "express";
import {
  login,
  registrarUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  desactivarUsuario,
  eliminarUsuario,
  activarUsuario
} from "../controladores/loginCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

// ============================
// 🧠 LOGIN y REGISTRO (libres)
// ============================
router.post("/usuarios", login);
router.post("/usuarios/registro", registrarUsuario);

// ============================
// 🔐 RUTAS PROTEGIDAS
// ============================

// 👁️ Listar todos los usuarios (solo admin)
router.get("/usuarios", verificarToken, verificarRolAdmin, listarUsuarios);

// 🔍 Obtener usuario por ID (el propio usuario o admin)
router.get("/usuarios/:id", verificarToken, obtenerUsuarioPorId);

// ✏️ Actualizar datos del usuario (solo autenticado)
router.put("/usuarios/:id", verificarToken, actualizarUsuario);

// 🚫 Desactivar usuario (borrado lógico)
router.put("/usuarios/desactivar/:id", verificarToken, desactivarUsuario);
router.put("/usuarios/activar/:id", verificarToken, activarUsuario);

// ❌ Eliminar físicamente un usuario (solo admin)
router.delete("/usuarios/:id", verificarToken, verificarRolAdmin, eliminarUsuario);

export default router;
