import { Router } from "express";
import auth from "./auth";
import user from "./user";
import rol from "./rol"

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/rol', rol);
export default routes;