import { Router } from "express";
import {UserController} from '../controller/users.controller.js';
const router = Router();

router.post("/premium/:uid", UserController.changeRol);

router.post("/:uid/documents",UserController.files);

export default router;