import chai from 'chai';
import supertest from 'supertest'; 

const expect = chai.expect; 
const requester = supertest('http://localhost:8080');

describe('Testing de carritos', () => {
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
        // console.log(cookie)
    });



    it('Se debe crear un producto correctamente y el resultado debe contener un array de products vacio', async function() {
        this.timeout(5000);

        const { statusCode, ok,  _body } = await requester.post('/api/carts').set('Cookie', [`${cookie.name}=${cookie.value}`]); 
        expect(statusCode).to.be.eql(200); 
        expect(_body.payload).to.have.property('products')
        expect(_body.payload.products).to.be.eql([])
    })

    it('Se debe obtener un producto correctamente y el resultado debe contener un array de products vacio', async  () => { 
        const cartResult = await requester.post('/api/carts').set('Cookie', [`${cookie.name}=${cookie.value}`]); 
        const id = cartResult._body.payload._id; 

        const { statusCode, ok,  _body } = await requester.get(`/api/carts/${id}`).set('Cookie', [`${cookie.name}=${cookie.value}`]); 

        expect(statusCode).to.be.eql(200); 
        expect(_body).to.have.property('data');
        expect(_body.data.products).to.be.eql([])
    })
})