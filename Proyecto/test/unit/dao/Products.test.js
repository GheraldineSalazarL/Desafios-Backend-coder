import mongoose from 'mongoose';
import Products from '../../../src/dao/dbManagers/products.js'
// import Assert from 'assert'; 
import chai from 'chai';
import config from '../../../src/config/config.js'; 

const URI = config.mongoUrlTesting; 

await mongoose.connect(URI);  //conexión a BD

// const assert = Assert.strict; //validar los resultados con mocha
const expect = chai.expect; //validar los resultados con chai

let productsDao;

describe('Probando nuestro dao de productos', () => {
    before(() => {
        productsDao = new Products();
    });

    beforeEach(async () => { //borrar las pruebas de la bd
        try {
            await mongoose.connection.collections.products.drop(); 
        } catch (error) {
            console.log(error)
        }
    }); 

    //Escenario 1
    it('El dao debe poder obtener los productos en formato de arreglo', async () =>{
        const result = await productsDao.getAll();
        // assert.strictEqual(Array.isArray(result), true);
        expect(result).to.be.deep.equal([]);
        expect(Array.isArray(result)).to.be.equal(true);
    })

    //Escenario 2
    it('El dao debe agergar los productos correctamente a la base de datos', async () =>{
        const mockProduct = {
            title: 'Prueba Save',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        };
        const result = await productsDao.save(mockProduct);
        // assert.ok(result._id); //comprueba si creo el producto con cierto _id
        expect(result._id).to.be.ok;
    })

    //Escenario 3
    it('El dao debe ontener un producto por id', async () =>{
        const mockProduct = {
            title: 'Prueba getById',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        };
        const result = await productsDao.save(mockProduct);

        const product = await productsDao.getById({ _id: result._id });

        // assert.strictEqual(typeof product, 'object');
        expect(typeof product).to.be.equal('object');
    })

    //Escenario 4
    it('El dao debe poder actualizar un producto', async () =>{
        const mockProduct = {
            title: 'Prueba update',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        };
        const result = await productsDao.save(mockProduct);

        const mockProductUpdate = {
            title: 'Prueba ejecutada update',
            description: 'Test'
        };

        await productsDao.update(mockProductUpdate, result._id);

        const product = await productsDao.getById({ _id: result._id });

        // assert.strictEqual(typeof product, 'object');
        expect(product.title).to.be.equal(mockProductUpdate.title);
        expect(product.description).to.be.equal(mockProductUpdate.description);
    });

    //Escenario 5
    it('El dao debe poder eliminar un producto', async () =>{
        const mockProduct = {
            title: 'Prueba update',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        };
        const result = await productsDao.save(mockProduct);

        await productsDao.deleteById( result._id ); 

        const products = await productsDao.getAll();
        // assert.strictEqual(Array.isArray(result), true);
        expect(products).to.be.deep.equal([]);
    })
})

// import mockingoose from 'mockingoose'; 
// import Products from '../../../src/dao/dbManagers/products.js';
// import { productsModel } from '../../../src/dao/models/products.js';

// describe('CARTS DAO', () => {
//     it('Debería retornar el listado de carritos', async () =>{
//         const productsDao = new Products();
//         mockingoose(productsModel).toReturn({
//             title: 'Prueba',
//             description: 'test mockingoose',
//             code: 'P1',
//             price: '50',
//             stock: 5,
//             category: 'Pruebas'
//         }, 'find'); 

//         const result = await productsDao.getAll(); 
//         console.log(result);
//         expect(Array.isArray(result)).to.be.eqls(true);
//     })
// })