import chai from 'chai';
import supertest from 'supertest'; 

const expect = chai.expect; 
const requester = supertest('http://localhost:8080');

describe('Testing de productos', () => {
    let cookie;

    before(async function() {
        this.timeout(5000);
        const userLoginMock = {
            email: "ch@gmail.com", 
            password: "1234", 
        }

        const loginResult = await requester.post('/api/sessions/login').send(userLoginMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
        expect(cookieResult).to.be.ok; 

        const cookieResultSplit = cookieResult.split('=')
        const localCookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        }

        cookie = localCookie;
    });



    it('POST de /api/products debe crear un producto correctamente', async function() {
        this.timeout(5000);
        const productMock = {
            title: 'Prueba Save en /api/products',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        }

        const { statusCode, ok,  _body } = await requester.post('/api/products').send(productMock).set('Cookie', [`${cookie.name}=${cookie.value}`]); 

        expect(statusCode).to.be.eql(200); 
        expect(_body.result).to.have.property('_id')
    })

    it('POST de /api/products se debe corroborar que el producto tenga el campo status en true', async () => {
        const productMock = {
            title: 'Prueba Save /api/products (status)',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        }

        const { statusCode, ok,  _body } = await requester.post('/api/products').send(productMock).set('Cookie', [`${cookie.name}=${cookie.value}`]);  
        
        expect(statusCode).to.be.eql(200); 
        expect(_body.result).to.have.property('status');
        expect(_body.result.status).to.be.eql('true');
    })

    it('POST de /api/products se debe corroborar que si no se envía los campos obligatorios debe retornar un bad request (400)', async () => {
        const productMock = {
            title: 'Prueba Save /api/products (campos obligatorios)',
            category: 'Room'
        }

        const { statusCode, ok,  _body } = await requester.post('/api/products').send(productMock).set('Cookie', [`${cookie.name}=${cookie.value}`]); 
        
        expect(statusCode).to.be.eql(500); 
        expect(_body.error.name).to.be.eql('ProductError')
    })

    it('GET de /api/products se debe corroborar que si la respuesta tiene el campo payload, además payload debe ser array', async () => {
        const { statusCode, ok,  _body } = await requester.get('/api/products').set('Cookie', [`${cookie.name}=${cookie.value}`]); 
        
        expect(statusCode).to.be.eql(200); 
        expect(_body.result).to.have.property('payload');
        expect(Array.isArray(_body.result.payload)).to.be.eql(true)
    })

    it('PUT de /api/products/:pid se debe corroborar que se actualice el producto con id', async () => {
        const productMock = {
            title: 'Prueba Save /api/products/:pid (update)',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        } 

        const { _body } = await requester.post('/api/products').send(productMock).set('Cookie', [`${cookie.name}=${cookie.value}`]); 
        const id = _body.result._id; 

        const productMockUpdate = {
            description: 'Prueba update',
        }

        const putResult = await requester.put(`/api/products/${id}`).send(productMockUpdate).set('Cookie', [`${cookie.name}=${cookie.value}`]);
                
        expect(putResult.statusCode).to.be.eql(200); 
        expect(putResult._body.message).to.be.eql('Producto Modificado');
    })

    it('DELETE de /api/products/:pid se debe corroborar que se elimine el ultimo producto agregado ', async () => {
        const productMock = {
            title: 'Prueba Save /api/products/:pid (delete)',
            description: 'color sahara',
            code: 'MN1',
            price: '50',
            stock: 5,
            category: 'Room'
        } 

        const { _body } = await requester.post('/api/products').send(productMock).set('Cookie', [`${cookie.name}=${cookie.value}`]); 
        const id = _body.result._id; 

        const deleteResult = await requester.delete(`/api/products/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]);
                
        expect(deleteResult.statusCode).to.be.eql(200); 
        expect(deleteResult._body.message).to.be.eql('Producto Eliminado')
    })
})