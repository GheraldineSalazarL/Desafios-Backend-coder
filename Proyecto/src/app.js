import express from "express";
import handlebars from 'express-handlebars';
import {__dirname} from './utils.js';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import initializePassport from './config/passport.config.js';

// import productsRouter from './routes/api/products.router.js';
// import cartsRouter from './routes/api/carts.router.js';
import viewsRouter from './routes/web/views.router.js';
import authGithub from './routes/api/authGithub.router.js';
// import Manager from './dao/fileManagers/Manager.js';

import Products from './dao/dbManagers/products.js';
import Chat from './dao/dbManagers/messages.js'

import UsersRouter from "./routes/api/users.router.js";
import SessionRouter from "./routes/api/sessions.router.js";
import CartsRouter from "./routes/api/carts.router.js";
import ProductsRouter from './routes/api/products.router.js';

import './dao/dbConfig.js';
import { sessionMiddleware } from "./dao/dbConfig.js";

const usersRouter = new UsersRouter();
const sessionRouter = new SessionRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();

const app = express ();

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.use(sessionMiddleware);

app.use(cookieParser());

//Configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); 
app.use('/api/authGithub', authGithub);
app.use('/api/sessions', sessionRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());

const server = app.listen(8080, () => console.log('Listening'));


// -------------------------------------------------------socket----------------------------------------------------------------------------------

const io = new Server(server);

// const manager = new Manager(`${__dirname}/files/productos.json`);
const productsManager = new Products();
const chatManager = new Chat();

const messages = [];

io.on('connection', async socket => {
    console.log("Cliente conectado")
    
    //web productos
    // const products = await manager.getAll();
    const products = await productsManager.getAll();

    io.emit('products', products);

    socket.on('newProduct',  async  data => {
        await productsManager.save(data);
        // await manager.save(data);
        const productsAll = await productsManager.getAll();
        io.emit('products', productsAll);
    })
    
    socket.on('spliced', async data => {
        await productsManager.deleteById(data);
        // await manager.deleteById(data);

        const productsAll = await productsManager.getAll();
        io.emit('products', productsAll);
    })


    //web chat
    socket.on('message', async data => {
        messages.push(data);
        await chatManager.save(data);
        io.emit('messageLogs', messages);
    });

    socket.on('authenticated', data => {
        socket.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConnected', data);
    });
});






