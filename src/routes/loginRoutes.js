import { Router } from "express";
import {login, registrarUsuario} from '../controladores/loginCtrl.js'

const router=Router();

router.post('/usuarios',login)
router.post('/usuarios', registrarUsuario)
export default router