import passport from "passport";
import LocalStrategy  from "passport-local";
import  userModel  from "../dao/models/Users.model.js";
import {createHash, isValidPassword } from '../utils.js';
import cartsModel from "../dao/models/cart.models.js";

const inicializePassport = ()=>{
    //Estrategia de registro
    passport.use("register", new LocalStrategy(
        {
            usernameField:"email",
            passReqToCallback:true
        },
        async(req,username,password,done)=>{
            console.log("init")
            try {
                const {first_name} = req.body;
                const user = await userModel.findOne({email:username});
                if(user){
                    return done(null,false)
                }

                let rol='user';
                if (username.endsWith("@coder.com")) {
                    rol = "admin";
                }
                const hashedPassword = await createHash(password);
                const cartUser = await cartsModel.create({});
                const newUser = {
                    name:first_name,
                    email:username,
                    password:hashedPassword,
                    rol,
                    cart:cartUser._id
                };
                console.log(newUser)
                const userCreated = await userModel.create(newUser);
                return done(null,userCreated)
            } catch (error) {
                console.log(error.message);
                return done(error);
            }
        }
    ));

    //estrategia de login con passport-local
    passport.use("login", new LocalStrategy(
        {
            usernameField:"email"
        },
        async (username, password, done)=>{
            try {
                const user = await userModel.findOne({email:username});
                if(!user){
                    return done(null, false);
                }
                //usuario existe, validar contraseña
                if(!isValidPassword(password, user)) return done(null, false);
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    //serializacion y deserializacion
    passport.serializeUser((user,done)=>{
        done(null,user._id)
    });//sesion {cookie, passport:user:id}

    passport.deserializeUser(async(id,done)=>{
        const userDB = await userModel.findById(id);
        done(null, userDB)
    });//req.user = userDB
}
export default inicializePassport;