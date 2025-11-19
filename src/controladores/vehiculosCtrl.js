import { conmysql } from "../db.js";
import cloudinary from "../config/cloudinary.js";

// 🚗 Listar todos los vehículos (solo admin)
export const getVehiculos = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM vehiculos');
    res.json({ cant: result.length, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los vehículos" });
  }
};

// 🔍 Obtener vehículo por ID
export const getVehiculoById = async (req, res) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM vehiculos WHERE vehiculo_id=?', [req.params.id]);
    if (result.length === 0) return res.status(404).json({ message: "Vehículo no encontrado" });
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// ➕ Registrar vehículo (cliente autenticado)
export const postVehiculo = async (req, res) => {
  try {
    const { placa, marca, modelo, color } = req.body;
    const user_id = req.user.id;  // el token tiene info del usuario autenticado
    let imagen_url = null;

    // Verificar si se subió imagen
    if (req.files && req.files.imagen) {
      const imagen = req.files.imagen;
      const result = await cloudinary.uploader.upload(imagen.tempFilePath, {
        folder: "vehiculos"
      });
      imagen_url = result.secure_url;
    }

    const [result] = await conmysql.query(
      `INSERT INTO vehiculos (user_id, placa, marca, modelo, color, imagen_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, placa, marca, modelo, color, imagen_url]
    );

    res.json({ message: "Vehículo registrado correctamente", vehiculo_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar vehículo" });
  }
};

// ✏️ Actualizar vehículo
export const putVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const { placa, marca, modelo, color } = req.body;

    const [existing] = await conmysql.query('SELECT imagen_url FROM vehiculos WHERE vehiculo_id=?', [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Vehículo no encontrado" });

    let imagen_url = existing[0].imagen_url;

    if (req.files && req.files.imagen) {
      const imagen = req.files.imagen;
      const result = await cloudinary.uploader.upload(imagen.tempFilePath, { folder: "vehiculos" });
      imagen_url = result.secure_url;
    }

    await conmysql.query(
      `UPDATE vehiculos SET placa=?, marca=?, modelo=?, color=?, imagen_url=? WHERE vehiculo_id=?`,
      [placa, marca, modelo, color, imagen_url, id]
    );

    const [vehiculoActualizado] = await conmysql.query('SELECT * FROM vehiculos WHERE vehiculo_id=?', [id]);
    res.json(vehiculoActualizado[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar vehículo" });
  }
};

// ❌ Eliminar vehículo
export const deleteVehiculo = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query('DELETE FROM vehiculos WHERE vehiculo_id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Vehículo no encontrado" });
    res.json({ message: "Vehículo eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar vehículo" });
  }
};

// 🚗 Listar vehículos del usuario autenticado
export const getMisVehiculos = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [result] = await conmysql.query(
      "SELECT * FROM vehiculos WHERE user_id = ?",
      [user_id]
    );

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener tus vehículos" });
  }
};
