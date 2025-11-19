import { Router } from "express";
import {
  getVehiculos,
  getVehiculoById,
  postVehiculo,
  putVehiculo,
  deleteVehiculo,
  getMisVehiculos 
} from "../controladores/vehiculosCtrl.js";

import { verificarToken } from "../middlewares/verificarToken.js";
import { verificarRolAdmin } from "../middlewares/verificarRol.js";

const router = Router();

// Solo admin puede listar todos los vehículos
router.get("/vehiculos", verificarToken, verificarRolAdmin, getVehiculos);

// Cliente autenticado puede ver sus vehículos
router.get("/vehiculos/:id", verificarToken, getVehiculoById);

// Registrar vehículo (cliente autenticado, usando form-data)
router.post("/vehiculos", verificarToken, postVehiculo);

// Actualizar vehículo
router.put("/vehiculos/:id", verificarToken, putVehiculo);

// Eliminar vehículo (solo admin)
router.delete("/vehiculos/:id", verificarToken, verificarRolAdmin, deleteVehiculo);

// Vehículos del usuario autenticado
router.get("/vehiculos/misvehiculos", verificarToken, getMisVehiculos);

export default router;
