import { usersDao } from "../dao/index.js";
import {createHash, generateEmailToken, isValidPassword,verifyEmailToken} from '../utils.js';
import {sendRecoveryPass} from '../utils/email.js';

class SessionController{
    static register = async(req,res) => {
      try {
        res.send({status:'success',message:'User registrado'})
      } catch (error) {
        req.logger.error('Error de conexion')
        res.status(500).send({
          error:error.message
        })
      }

      }

    static failRegister = async(req,res)=>{
        try {
          res.send({error:'Fallo en el registro'})
        } catch (error) {
          req.logger.error('Error de conexion')
          res.status(500).send({
            error:error.message
          })
        }

    }      
    static failLogin = (req,res)=>{
      try {
        res.send({error:'fail login'})
      } catch (error) {
        req.logger.error('Error de conexion')
        res.status(500).send({error:error.message})
      }

    }
    static github = async (req,res)=>{};

    static githubCallBack = async (req,res)=>{
      try {
        req.session.user = req.user;
        res.redirect('/');
      } catch (error) {
        req.logger.error('Error de conexion')
        res.status(500).send({error:error.message})
      }

    }    
    static login =   async(req,res) => {
      try {
        if(!req.user){
          return res.status(400).send({status:'error'})
        }
        req.session.user = {
          first_name:req.user.first_name,
          last_name:req.user.last_name,
          age:req.user.age,
          email:req.user.email,
          cart:req.user.cart
        }
        res.send({status:'success',payload:req.user})  
      } catch (error) {
        req.logger.error('Error de conexion')
        res.status(500).send({error:error.message})
      }

      }
    
    static logout = (req, res) => {
      try {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).send({
              status: "error",
              error: "No se pudo desloguear",
            });
          }
          res.redirect("/");
        });
      } catch (error) {
        req.logger.error('Error de conexion')
        res.status(500).send({error:error.message})
      }


      }

      static  forgotPassword = async (req, res) => {
        try {
          const {email} = req.body;
          const user = await usersDao.getBy({email});
          if(!user){
              res.send(`<div>Error no existe el usuario, vuelva a intentar: <a href="/forgot-password">Intente de nuevo</a></div>`)
          }
          console.log('object');
          const token = generateEmailToken(email, 3600);
          console.log(token)
         await sendRecoveryPass(email, token);
          res.send("Se envio el correo de recuperacion.")
  
      } catch (error) {   
          res.send(`<div>Error,<a href="/forgot-password">Intente de nuevo</a></div>`)
      }
  
    }

    
      static  resetPassword = async (req, res) => {
        try {
          const token = req.query.token;
  
          const {email, newPassword} = req.body;
  
          const validToken = verifyEmailToken(token);
  
          if(!validToken){
              return res.send(`El token ya no es valido`);
          }
          const user = await usersDao.getBy({email});
  
          if(!user){
              return res.send("el Usuario no esta registrado")   
          }
  
          console.log(user)
          if(isValidPassword(newPassword,user)){
              return res.send("no se puede usar la misma contraseña")
          }
          const hashedPassword =  createHash(newPassword);
          
          const userData = {
              ...user._doc,
              password:hashedPassword
          }
          const id = userData._id;
          const updateUser = await usersDao.updateUser(id,userData);
          res.render("login", {message:"Contraseña actualizada"})
      } catch (error) {
          console.log(error);
          res.send(`<div>Error, hable con el administrador.</div>`)
      }
      }

}

export {SessionController};