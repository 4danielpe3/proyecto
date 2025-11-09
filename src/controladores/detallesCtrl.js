import { conmysql } from "../db.js";

// ============================
// 🧩 CREAR DETALLES (solo cliente autenticado)
// ============================
export const crearDetalles = async (req, res) => {
  const user_id = req.user.id; // viene del token
  const { nombres, apellidos, correo, telefono, direccion } = req.body;

  try {
    // Verificar si ya tiene detalles registrados
    const [existe] = await conmysql.query(
      "SELECT * FROM detalles_usuario WHERE user_id = ?",
      [user_id]
    );

    if (existe.length > 0) {
      return res.status(400).json({ message: "Ya existen detalles para este usuario" });
    }

    // Insertar detalles
    await conmysql.query(
      "INSERT INTO detalles_usuario (user_id, nombres, apellidos, correo, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, nombres, apellidos, correo, telefono, direccion]
    );

    res.status(201).json({ message: "Detalles creados correctamente" });
  } catch (error) {
    console.error("Error al crear detalles:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ============================
// 👁️ OBTENER DETALLES PROPIOS
// ============================
export const obtenerMisDetalles = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [rows] = await conmysql.query(
      "SELECT * FROM detalles_usuario WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron detalles" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener detalles:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ============================
// ✏️ ACTUALIZAR DETALLES PROPIOS
// ============================
export const actualizarMisDetalles = async (req, res) => {
  const user_id = req.user.id;
  const { nombres, apellidos, correo, telefono, direccion } = req.body;

  try {
    await conmysql.query(
      "UPDATE detalles_usuario SET nombres = ?, apellidos = ?, correo = ?, telefono = ?, direccion = ? WHERE user_id = ?",
      [nombres, apellidos, correo, telefono, direccion, user_id]
    );

    res.json({ message: "Detalles actualizados correctamente" });
  } catch (error) {
    console.error("Error al actualizar detalles:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ============================
// 📋 LISTAR TODOS LOS DETALLES (solo admin)
// ============================
export const listarDetalles = async (req, res) => {
  try {
    const [rows] = await conmysql.query("SELECT * FROM detalles_usuario");
    res.json(rows);
  } catch (error) {
    console.error("Error al listar detalles:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ============================
// ❌ ELIMINAR DETALLE (solo admin)
// ============================
export const eliminarDetalle = async (req, res) => {
  const { detalle_id } = req.params;

  try {
    await conmysql.query("DELETE FROM detalles_usuario WHERE detalle_id = ?", [detalle_id]);
    res.json({ message: "Detalle eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar detalle:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
