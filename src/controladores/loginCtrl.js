import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import { conmysql } from "../db.js";

// Función para convertir texto a MD5
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
    // Buscar usuario activo
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

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.user_id,
        username: user.username,
        rol: user.rol,
      },
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
    // Verificar si el usuario ya existe
    const [existe] = await conmysql.query(
      "SELECT * FROM usuarios WHERE username = ?",
      [username]
    );
    if (existe.length > 0) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña con MD5
    const claveMD5 = md5Hash(contrasena);

    // Insertar nuevo usuario con rol visitante
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
