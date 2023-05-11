import { Router } from "express";
import { UserController } from "./../controller/UserController";

const router = Router();

router.get('/userbyid/:id_user',UserController.getUsersById)
router.get('/users', UserController.getUsers);

export default router;