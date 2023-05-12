import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js'; 
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = config.secret;
const SERVICE = config.service;
const PORT = config.port;
const USER = config.user;
const PASS = config.pass;


const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); 
const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password); 

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

export {
    __dirname,
    createHash,
    isValidPassword,
    hashData,
    compareHashedData,
    generateToken,
    PRIVATE_KEY,
    transporter
}

