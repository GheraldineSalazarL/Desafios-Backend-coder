import passport from 'passport';
import local from 'passport-local';
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
            req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
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
            req.logger.error(`${req.method} en ${req.url} - ${new Date().toISOString()} - ${error}`);
            return done(error);
        }
    }));

};

export default initializePassport;
