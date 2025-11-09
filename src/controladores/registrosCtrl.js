import { conmysql } from "../db.js";

// 🟢 Crear registro de visita (usuario con solicitud aceptada)
export const crearRegistroVisita = async (req, res) => {
  try {
    const user_id = req.user.id; // viene del token
    const { vehiculo_id } = req.body;

    if (!vehiculo_id) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // ✅ Verificar que el vehículo pertenece al usuario
    const [vehiculo] = await conmysql.query(
      "SELECT * FROM vehiculos WHERE vehiculo_id = ? AND user_id = ?",
      [vehiculo_id, user_id]
    );

    if (vehiculo.length === 0) {
      return res
        .status(403)
        .json({ message: "El vehículo no pertenece al usuario autenticado" });
    }

    // ✅ Verificar si el vehículo tiene una solicitud aceptada
    const [solicitud] = await conmysql.query(
      "SELECT * FROM solicitudes WHERE user_id = ? AND vehiculo_id = ? AND estado = 'aceptada'",
      [user_id, vehiculo_id]
    );

    if (solicitud.length === 0) {
      return res
        .status(403)
        .json({ message: "No existe una solicitud aceptada para este vehículo" });
    }

    // ✅ Registrar la visita
    const [result] = await conmysql.query(
      "INSERT INTO registros_visitas (user_id, vehiculo_id) VALUES (?, ?)",
      [user_id, vehiculo_id]
    );

    res.status(201).json({
      message: "Registro de visita creado correctamente",
      registro_id: result.insertId,
    });
  } catch (error) {
    console.error("Error al crear registro de visita:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟡 Listar todos los registros con solicitudes activas (solo admin)
export const listarRegistros = async (req, res) => {
  try {
    const [rows] = await conmysql.query(
      `SELECT 
          r.registro_id,
          u.username AS usuario,
          v.placa,
          v.marca,
          v.modelo,
          s.estado AS estado_solicitud,
          r.fecha_ingreso
       FROM registros_visitas r
       JOIN usuarios u ON r.user_id = u.user_id
       JOIN vehiculos v ON r.vehiculo_id = v.vehiculo_id
       JOIN solicitudes s ON s.user_id = r.user_id 
                         AND s.vehiculo_id = r.vehiculo_id
       WHERE s.estado = 'aceptada'
       ORDER BY r.fecha_ingreso DESC`
    );

    if (rows.length === 0) {
      return res.json({ message: "No hay registros con solicitudes activas" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al listar registros de visitas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔵 Listar registros del usuario autenticado
export const listarMisRegistros = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await conmysql.query(
      `SELECT 
          r.registro_id,
          v.placa,
          v.marca,
          v.modelo,
          r.fecha_ingreso
       FROM registros_visitas r
       JOIN vehiculos v ON r.vehiculo_id = v.vehiculo_id
       WHERE r.user_id = ?
       ORDER BY r.fecha_ingreso DESC`,
      [user_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al listar mis registros:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔴 Eliminar registro (solo admin)
export const eliminarRegistro = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query(
      "DELETE FROM registros_visitas WHERE registro_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json({ message: "Registro de visita eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar registro de visita:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
