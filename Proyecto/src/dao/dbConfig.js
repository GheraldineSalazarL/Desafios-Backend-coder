import mongoose from 'mongoose'; 
import session from 'express-session';
import MongoStore from 'connect-mongo';
import config from '../config/config.js'; 

const URI = config.mongoUrl; 
const SECRET = config.secret;

//conexión mongoDB
try{
    await mongoose.connect(URI); 
    console.log('Conectado a BD');
}catch(error){
    console.log(error);
}

//Configuración de sesión

const sessionMiddleware = session({
    store: MongoStore.create({
        mongoUrl: URI,
        mongoOptions: { useNewUrlParser: true },
        ttl: 3600
    }),
    secret: SECRET,
    resave: true,
    saveUninitialized: true
})
export { sessionMiddleware }


