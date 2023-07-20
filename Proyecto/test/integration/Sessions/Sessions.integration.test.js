import chai from 'chai';
import supertest from 'supertest'; 

const expect = chai.expect; 
const requester = supertest('http://localhost:8080');

describe('Testing de Sessions', () => {
    let cookie;

    it('Se debe registrar de un usuario correctamente', async function() {
        this.timeout(5000);
        const userMock = {
            first_name: "Coder", 
            last_name: "House", 
            email: "ch@gmail.com", 
            age: "19", 
            password: "1234", 
            rol: "ADMIN"
        }

        const { statusCode, _body } = await requester.post('/api/sessions/register').send(userMock);
        expect(statusCode).to.be.eql(200);
        expect(_body).to.be.ok;
    })

    it('Se debe loguear un usuario correctamente y retornar una cookie', async function() {
        this.timeout(5000);
        const userLoginMock = {
            email: "ch@gmail.com", 
            password: "1234", 
        }

        const loginResult = await requester.post('/api/sessions/login').send(userLoginMock);
        const cookieResult = loginResult.headers['set-cookie'][0];
      
        expect(cookieResult).to.be.ok; 

        const cookieResultSplit = cookieResult.split('=')
        cookie = {
            name: cookieResultSplit[0],
            value: cookieResultSplit[1]
        }

        expect(cookie.name).to.be.ok.and.eql('token');
        expect(cookie.value).to.be.ok;
    })

    it('Se debe enviar una cookie en el servicio api/users/currentUser y entregue la info del usuario', async () => {
        const { _body } = await requester.get('/api/users/currentUser').set('Cookie', [`${cookie.name}=${cookie.value}`]);
        expect(_body.data.email).to.be.eql('ch@gmail.com');
    })
})