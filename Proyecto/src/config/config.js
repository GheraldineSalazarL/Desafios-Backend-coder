import dotenv from 'dotenv'; 

dotenv.config(); 

export default {
    // persistence: process.env.PERSISTENCE,
    mongoUrl: process.env.MONGO_URL,
    secret: process.env.SECRET,
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET
}