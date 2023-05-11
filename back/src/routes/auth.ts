import { Router } from "express";
import AuthController from "./../controller/AuthController";

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/describe_user/:id_user',AuthController.login_describe_user);
router.get('/social/:idToken', AuthController.loginSocial);

export default router;