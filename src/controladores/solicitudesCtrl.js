import { conmysql } from "../db.js";

// 🟢 Crear nueva solicitud
export const crearSolicitud = async (req, res) => {
  try {
    const { vehiculo_id, motivo } = req.body;
    const user_id = req.user.id; // viene del token

    if (!vehiculo_id || !motivo) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await conmysql.query(
      `INSERT INTO solicitudes (user_id, vehiculo_id, motivo)
       VALUES (?, ?, ?)`,
      [user_id, vehiculo_id, motivo]
    );

    res.status(201).json({
      message: "Solicitud creada correctamente",
      solicitud_id: result.insertId
    });
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟡 Listar todas las solicitudes (solo admin)
export const listarSolicitudes = async (req, res) => {
  try {
    const [rows] = await conmysql.query(
      `SELECT s.*, u.username, v.placa, v.marca
       FROM solicitudes s
       JOIN usuarios u ON s.user_id = u.user_id
       JOIN vehiculos v ON s.vehiculo_id = v.vehiculo_id`
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar solicitudes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟢 Listar solicitudes del usuario autenticado
export const listarMisSolicitudes = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await conmysql.query(
      `SELECT s.*, v.placa, v.marca
       FROM solicitudes s
       JOIN vehiculos v ON s.vehiculo_id = v.vehiculo_id
       WHERE s.user_id = ?`,
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al listar mis solicitudes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔍 Obtener una solicitud por ID
export const obtenerSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await conmysql.query(
      `SELECT s.*, u.username, v.placa, v.marca
       FROM solicitudes s
       JOIN usuarios u ON s.user_id = u.user_id
       JOIN vehiculos v ON s.vehiculo_id = v.vehiculo_id
       WHERE s.solicitud_id = ?`,
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Solicitud no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟠 Actualizar estado (solo admin)
export const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!["pendiente", "aceptada", "rechazada"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    await conmysql.query(
      "UPDATE solicitudes SET estado = ? WHERE solicitud_id = ?",
      [estado, id]
    );

    res.json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔴 Eliminar solicitud (solo admin)
export const eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query(
      "DELETE FROM solicitudes WHERE solicitud_id = ?",
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Solicitud no encontrada" });
    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
