import { Router } from "express";
import { RolController } from "./../controller/Rolcontroller";

const router = Router();

router.post('/registerRol', RolController.registerRol)


export default router;