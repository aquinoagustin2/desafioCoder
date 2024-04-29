import nodemailer from 'nodemailer';
import {options} from './option.js';

// Credenciales
const adminEmail = options.gmail.emailAdmin;
const adminPass = options.gmail.emailPass;

//Configurar el canal de comunicacion entre node y gmail

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    auth:{
        user:adminEmail,
        pass:adminPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
})

export {transporter};