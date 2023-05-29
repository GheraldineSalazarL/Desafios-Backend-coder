import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import User from '../dao/dbManagers/users.js'
import config from '../config/config.js'; 

const PRIVATE_KEY = config.secret;
const CLIENTID = config.clientId;
const CLIENTSECRET = config.clientSecret;

const LocalStrategy = local.Strategy;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const usersManager = new User();

const initializePassport = () => {

    //---------------------------Estrategia de autentificación (LocalStrategy)-------------------
    // passport.use('register', new LocalStrategy({
    //     passReqToCallback: true,
    //     usernameField: 'email'
    // }, async (req, username, password, done) => {
    //     const { first_name, last_name, email, age, rol } = req.body;

    //     try {
    //         const user = await usersManager.getByEmail(username); //username=email

    //         if (user) {
    //             console.log('user already exists');
    //             return done(null, false);
    //         }

    //         const newUser = {
    //             first_name,
    //             last_name,
    //             email,
    //             age,
    //             rol,
    //             password: createHash(password)
    //         }

    //         const result = await usersManager.saveUser(newUser);
    //         return done(null, result);

    //     } catch (error) {
    //         return done(`error registering user ${error}`);
    //     }
    // }));

    // passport.use('login', new LocalStrategy({
    //     usernameField: 'email'
    // }, async (username, password, done) => {
    //     try {
    //         const user = await usersManager.getByEmail(username);

    //         if (!user) {
    //             return done(null, false)
    //         }

    //         if (!isValidPassword(user, password)) return done(null, false)
                        
    //         return done(null, user);
    //     } catch (error) {
    //         return done(`User login error ${error}`);
    //     }
    // }));

    passport.use('github', new GitHubStrategy({
        clientID: CLIENTID,
        clientSecret: CLIENTSECRET,
        callbackURL: 'http://localhost:8080/api/authGithub/github-callback'
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            const user = await usersManager.getByEmail(profile._json.email); //email: profile._json.email
            if(!user){
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '', 
                    age: 0,
                    email: profile._json.email,
                    rol: 'USER',
                    password: ''
                };

                const result = await usersManager.saveUser(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        }catch(error){
            done(error)
            req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersManager.getById(id);
        done(null, user);
    });

    //-------------------------------------------JWT--------------------------------------------

    passport.use('jwt', new JWTStrategy({ 
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: PRIVATE_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
            req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
        }
    }));

};

export default initializePassport;
