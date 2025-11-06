export const verificarRolAdmin = (req, res, next) => {
  if (req.user.rol !== "administrador") {
    return res.status(403).json({ message: "Acceso denegado. Solo administradores." });
  }
  next();
};
