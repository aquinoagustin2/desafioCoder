import { Router } from "express";
import passport from "passport";
import { SessionController } from "../controller/sessions.controller.js";
import { getContactDTO } from "../dao/dto/contact.dto.js";

const router = Router();

router.post('/register',passport.authenticate('register',{failureRedirect:'/api/sessions/failregister'}),
SessionController.register)

router.get('/failregister',SessionController.failRegister)

router.get('/faillogin',SessionController.failLogin)


router.get('/github',passport.authenticate('github',{scope:['user:email']}),SessionController.github)


router.get('/githubcallback',passport.authenticate('github',{failureRedirect:'/login'}),SessionController.githubCallBack);



router.post('/login',passport.authenticate('login',{failureRedirect:'/api/session/faillogin'}),SessionController.login)

router.get("/logout", SessionController.logout);


router.post("/forgot-password",SessionController.forgotPassword);


router.post("/reset-password", SessionController.resetPassword);


router.get("/current", (req, res) => {
    try {
      if (req.session && req.session.user) {
        const userDTO = new getContactDTO(req.session.user);
        res.status(200).json({
          status: "success",
          user: userDTO
        });
      } else {
        res.status(401).json({
          status: "error",
          message: "No hay sesión de usuario activa"
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error al obtener el usuario actual"
      });
    }
  });
  

export default router;
