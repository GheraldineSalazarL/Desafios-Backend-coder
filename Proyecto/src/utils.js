import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js'; 
import nodemailer from 'nodemailer';
import { faker } from '@faker-js/faker/locale/es'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = config.secret;
const SERVICE = config.service;
const PORT = config.port;
const USER = config.user;
const PASS = config.pass;

const hashData = async (password) => {
    return bcrypt.hash(password,10); 
}

const compareHashedData = async (password, passwordDB) => {
    return bcrypt.compare(password, passwordDB);
}

const generateToken = (usuario) => {
    return jwt.sign(usuario, PRIVATE_KEY); 
}


//configuración SMTP gmail 
const transporter = nodemailer.createTransport({
    service: SERVICE, //servicio que vamos a usar  
    port: PORT, //puerto que usa gmail
    auth: { //autentificación que cree en gmail
        user: USER,
        pass: PASS
    }
});

//Faker
// faker.locale = 'es'; //deprecado 
const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alphanumeric(10),
        price: faker.commerce.price(),
        status: faker.helpers.arrayElement(["true", "false"]),
        stock: faker.string.numeric(1),
        category: faker.commerce.department(),
        thumbnails: faker.image.url(),
        id: faker.database.mongodbObjectId(),    
    }
}


export {
    __dirname,
    hashData,
    compareHashedData,
    generateToken,
    PRIVATE_KEY,
    transporter, 
    generateProduct
}

