import { Router } from "express";
import { checkRole } from "../middlewares/auth.js";

const router = Router();

router.get("/",checkRole(['user']) ,(req,res)=>{
    res.render("home", {});
})

export default router;