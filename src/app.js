import express from 'express';
import session from 'express-session';
import { cartRouter } from './routes/carts.routes.js';
import { productRouter } from './routes/products.routes.js';
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/viewsRouter.route.js';
import sessionRouter from './routes/sessions.routes.js';
import chatsRouter from './routes/chats.router.js';
import MongoStore from "connect-mongo";
import passport from 'passport';
import inicializePassport from './config/passport.config.js';
import {options} from './config/config.js';
import { Server } from "socket.io";
import { mockingRouter } from './routes/mocking.routes.js';
import {addLogger} from './config/logger.js';
import testRouter from './routes/test.routes.js';
import usersRouter from './routes/users.routes.js';
import { swaggerSpecs } from './config/docConfig.js';
import swaggerUi from 'swagger-ui-express';
const connection = mongoose.connect(options.mongo.url);

const PORT = options.server.port;
export const app = express();
let messages = [];



/* Secret */
app.use(session({
    store:new MongoStore({
        mongoUrl:options.mongo.url,
        ttl:3600
    }),
    secret:'CoderSecret',
    resave:false,
    saveUninitialized:false
}))

/* Passport */

inicializePassport();
app.use(passport.initialize());
app.use(passport.session())


/** Template engine */

app.engine('handlebars',handlebars.engine());
app.set('views',__dirname + '/views');
app.set('view engine','handlebars');



/***Middlewares */

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(addLogger);




//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter)
app.use('/api/sessions',sessionRouter);    
app.use('/api/mockingproducts',mockingRouter);
app.use('/loggertest',testRouter);
app.use('/api/users',usersRouter);
//end point docu
app.use('/api/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpecs));

const httpServer = app.listen(PORT, ()=>{
    console.log(`Servidor funcionando en el puerto: ${PORT}`);
})

/* WebSockets */
app.use("/chat", chatsRouter);

const io = new Server(httpServer);
io.on("connection", (socket)=>{
    
    socket.on("chat-message", (data)=>{
        messages.push(data);
        io.emit("messages", messages);
    })

    socket.on("new-user", (username)=>{
        socket.emit("messages",messages);
        socket.broadcast.emit("new-user", username);
    })
})