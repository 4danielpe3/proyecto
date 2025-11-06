import { Router } from "express";
import {login, registrarUsuario} from '../controladores/loginCtrl.js'

const router=Router();

router.post('/usuarios',login)
router.post('/usuarios/registro', registrarUsuario)
export default router