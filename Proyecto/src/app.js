import express from "express";
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import productsRouter from './routes/api/products.router.js';
import cartsRouter from './routes/api/carts.router.js';
import viewsRouter from './routes/web/views.router.js';
// import Manager from './dao/fileManagers/Manager.js';
import Products from './dao/dbManagers/products.js';
import Chat from './dao/dbManagers/messages.js'
import session from 'express-session';
import sessionsRouter from './routes/api/sessions.router.js';
import MongoStore from 'connect-mongo';
import initializePassport from './config/passport.config.js';
import passport from 'passport';

const app = express ();

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://gheeraldin:0TY8Sm5YXeGmNvoD@cluster0.jckhxnb.mongodb.net/?retryWrites=true&w=majority',
        mongoOptions: { useNewUrlParser: true },
        ttl: 3600
    }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized: true
}));

//Configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);

const server = app.listen(8080, () => console.log('Listening'));
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

try{
    await mongoose.connect('mongodb+srv://gheeraldin:0TY8Sm5YXeGmNvoD@cluster0.jckhxnb.mongodb.net/?retryWrites=true&w=majority') 
} catch(error){
    console.log(`Cannot connect to database: ${error}`)
};






