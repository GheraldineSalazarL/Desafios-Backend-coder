import mongoose from 'mongoose';
import Carts from '../../../src/dao/dbManagers/carts.js';
import chai from 'chai';
import config from '../../../src/config/config.js'; 

const URI = config.mongoUrlTesting; 

await mongoose.connect(URI);  //conexión a BD

const expect = chai.expect; //validar los resultados con chai

let cartsDao;

describe('Probando nuestro dao de carritos', () => {
    before(() => {
        cartsDao = new Carts();
    });

    beforeEach(async () => { 
        try {
            await mongoose.connection.collections.carts.drop(); 
        } catch (error) {
            console.log(error)
        }
    }); 


    //Escenario 1
    it('El dao agregará al carrito creado un arreglo de productos vacio por defecto', async () =>{
        const result = await cartsDao.save();
        expect(result.products).to.be.deep.equal([]);
    })

})