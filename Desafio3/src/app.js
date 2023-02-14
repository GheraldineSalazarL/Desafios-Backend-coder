import express from 'express';
import ProductManager from './ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const productManager = new ProductManager(path.join(dirname, 'productos.json'));

app.use(express.urlencoded({extended: true}));

app.get('/products', async (req, res) => {
    //query
    const products = await productManager.getAll();
    const {limit} = req.query;

    if(!limit) return res.send(products);

    const productosFiltrados = []
    if(limit <= products.length){
        for(var i=0; i<limit; i++){
            productosFiltrados.push(products[i])
        }
        res.send(productosFiltrados)
    } else {res.send({error:`Sólo exiten ${products.length} productos`})}
})

app.get('/products/:pid', async (req,res)=> {
    const pid = Number(req.params.pid);
    const product = await productManager.getById(pid);
    if(!product) return res.send({error:'Producto no encontrado'});
    res.send(product);
})


app.listen(8080,()=>console.log("Listening on 8080"))