import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import { conmysql } from "../db.js";

// ======================
// 🔐 FUNCIÓN PARA ENCRIPTAR CONTRASEÑAS (MD5)
// ======================
const md5Hash = (texto) => createHash("md5").update(texto).digest("hex");

// ======================
// 🧠 LOGIN DE USUARIOS
// ======================
export const login = async (req, res) => {
  const { username, contrasena } = req.body;

  if (!username || !contrasena) {
    return res.status(400).json({ message: "Debe ingresar usuario y contraseña" });
  }

  try {
    const [rows] = await conmysql.query(
      "SELECT * FROM usuarios WHERE username = ? AND estado = 'activo'",
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado o bloqueado" });
    }

    const user = rows[0];
    const claveMD5 = md5Hash(contrasena);

    if (user.contrasena !== claveMD5) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token con rol y datos del usuario
    const token = jwt.sign(
      { id: user.user_id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.user_id,
        username: user.username,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ======================
// 🧩 REGISTRO DE USUARIOS VISITANTES
// ======================
export const registrarUsuario = async (req, res) => {
  const { username, contrasena } = req.body;

  if (!username || !contrasena) {
    return res.status(400).json({ message: "Debe ingresar usuario y contraseña" });
  }

  try {
    const [existe] = await conmysql.query(
      "SELECT * FROM usuarios WHERE username = ?",
      [username]
    );
    if (existe.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const claveMD5 = md5Hash(contrasena);

    await conmysql.query(
      "INSERT INTO usuarios (username, contrasena, rol, estado) VALUES (?, ?, 'visitante', 'activo')",
      [username, claveMD5]
    );

    res.status(201).json({ message: "Usuario visitante registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ======================
// 👁️ LISTAR TODOS LOS USUARIOS (Solo admin)
// ======================
export const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await conmysql.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ======================
// 🔍 OBTENER DETALLE DE UN USUARIO POR ID
// ======================
export const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await conmysql.query("SELECT * FROM usuarios WHERE user_id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ======================
// ✏️ ACTUALIZAR DATOS DE UN USUARIO
// ======================
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { username, rol, estado } = req.body;

  try {
    await conmysql.query(
      "UPDATE usuarios SET username = ?, rol = ?, estado = ? WHERE user_id = ?",
      [username, rol, estado, id]
    );

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ======================
// 🚫 DESACTIVAR (BORRADO LÓGICO)
// ======================
export const desactivarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await conmysql.query(
      "UPDATE usuarios SET estado = 'inactivo' WHERE user_id = ?",
      [id]
    );

    res.json({ message: "Usuario desactivado correctamente" });
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ======================
// ❌ ELIMINAR FÍSICAMENTE UN USUARIO (Solo admin)
// ======================
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    await conmysql.query("DELETE FROM usuarios WHERE user_id = ?", [id]);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
