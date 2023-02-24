import express from "express";
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import viewsRouter from './routes/views.router.js';
import Manager from './Manager.js';

const app = express ();

app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const server = app.listen(8080, () => console.log('Listening'));
const io = new Server(server);

const manager = new Manager(`${__dirname}/files/productos.json`);

io.on('connection', async socket => {
    console.log("Cliente conectado")
    
    const products = await manager.getAll();
    io.emit('products', products);

    socket.on('message',  async  data => {
        
        if(!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category){
            window.alert('Valores incompletos');
            return
        } 

        await manager.save(data);
        
        io.emit('products', products);
    })
    
    socket.on('spliced', async data => {
        await manager.deleteById(data)
        const products = await manager.getAll();
        io.emit('products', products);
    })
});