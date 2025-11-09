import { Router } from "express";
import {
  getVehiculos,
  getVehiculoById,
  postVehiculo,
  putVehiculo,
  deleteVehiculo
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

export default router;
