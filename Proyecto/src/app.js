import express from "express";
import handlebars from 'express-handlebars';
import {__dirname} from './utils.js';
import { Server } from 'socket.io';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'

import initializePassport from './config/passport.config.js';

import Products from './dao/dbManagers/products.js';
import Chat from './dao/dbManagers/messages.js'

import viewsRouter from './routes/web/views.router.js';
import authGithub from './routes/api/authGithub.router.js';
import UsersRouter from "./routes/api/users.router.js";
import SessionRouter from "./routes/api/sessions.router.js";
import CartsRouter from "./routes/api/carts.router.js";
import ProductsRouter from './routes/api/products.router.js';

import * as productsService from './services/products.service.js'; 


import { loggerTest } from "./routes/api/loggerTest.js";

import './dao/dbConfig.js';
import { sessionMiddleware } from "./dao/dbConfig.js";

import CustomError from "./services/errors/CustomError.js";
import EErrors from "./services/errors/enum.js";
import { generateProductErrorInfo } from "./services/errors/info.js";
import errorHandler from './middlewares/errors/index.js';

import { addLogger } from "./logger.js";


const usersRouter = new UsersRouter();
const sessionRouter = new SessionRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();

const app = express ();

app.use(errorHandler);
app.use(addLogger);

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

//Documentación API's
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación del proyecto de Tienda',
            description: 'API pensada para resolver el proceso de ventas de productos de un tienda'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.use(sessionMiddleware);

app.use(cookieParser());

//Configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter); 
app.use('/api/authGithub', authGithub);
app.use('/api/sessions', sessionRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/loggerTest', loggerTest); 


const server = app.listen(8080, () => console.log('Listening'));


// ----------------------------------socket--------------------------------------

const io = new Server(server);

const productsManager = new Products();
const chatManager = new Chat();

const messages = [];

io.on('connection', async socket => {
    console.log("Cliente conectado")
    
    //web productos
    const products = await productsManager.getAll();

    io.emit('products', products);

    socket.on('newProduct', async data => {
        try {
            if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category) {
                throw CustomError.createError({
                    name: 'UserError',
                    cause: generateProductErrorInfo({
                        title: data.title,
                        description: data.description,
                        code: data.code,
                        price: data.price,
                        stock: data.stock, 
                        category: data.category
                    }),
                    message: 'Error tratando de crear un producto',
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }
            await productsManager.save(data);
            
            const productsAll = await productsManager.getAll();
            io.emit('newProductAdded', { success: true });

            io.emit('products', productsAll);
        } catch (error) {
            console.log(error.message);
            io.emit('warningMessage', 'Por favor, completa todos los campos antes de crear el nuevo producto.');
        }
    });

    socket.on('spliced', async data => {
        let token = socket.request.headers.cookie?.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        await productsService.deleteProduct(data, token);

        const productsAll = await productsManager.getAll();
        io.emit('products', productsAll);
    })


    //web chat
    io.emit('messageLogs', messages);

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






