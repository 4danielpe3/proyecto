import { conmysql } from "../db.js";

// 🟢 Enviar mensaje (solo admin)
export const enviarMensaje = async (req, res) => {
  try {
    const { user_id, contenido, tipo } = req.body;
    const admin_id = req.user.id; // Viene del token del admin

    if (!user_id || !contenido) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const [result] = await conmysql.query(
      `INSERT INTO mensajes (user_id, admin_id, contenido, tipo)
       VALUES (?, ?, ?, ?)`,
      [user_id, admin_id, contenido, tipo || 'general']
    );

    res.status(201).json({
      message: "Mensaje enviado correctamente",
      mensaje_id: result.insertId,
    });
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟡 Listar todos los mensajes (solo admin)
export const listarMensajes = async (req, res) => {
  try {
    const [rows] = await conmysql.query(`
      SELECT m.*, 
             u.username AS usuario, 
             a.username AS admin
      FROM mensajes m
      JOIN usuarios u ON m.user_id = u.user_id
      JOIN usuarios a ON m.admin_id = a.user_id
      ORDER BY m.fecha_envio DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al listar mensajes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🟢 Listar mensajes del usuario autenticado
export const listarMisMensajes = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await conmysql.query(`
      SELECT m.*, a.username AS admin
      FROM mensajes m
      JOIN usuarios a ON m.admin_id = a.user_id
      WHERE m.user_id = ?
      ORDER BY m.fecha_envio DESC
    `, [user_id]);

    res.json(rows);
  } catch (error) {
    console.error("Error al listar mis mensajes:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔍 Obtener mensaje por ID (solo admin)
export const obtenerMensaje = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await conmysql.query(`
      SELECT m.*, 
             u.username AS usuario, 
             a.username AS admin
      FROM mensajes m
      JOIN usuarios u ON m.user_id = u.user_id
      JOIN usuarios a ON m.admin_id = a.user_id
      WHERE m.mensaje_id = ?
    `, [id]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Mensaje no encontrado" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener mensaje:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🔴 Eliminar mensaje (solo admin)
export const eliminarMensaje = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await conmysql.query(
      "DELETE FROM mensajes WHERE mensaje_id = ?",
      [id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Mensaje no encontrado" });

    res.json({ message: "Mensaje eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
