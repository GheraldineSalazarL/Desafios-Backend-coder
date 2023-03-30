import passport from 'passport';
import local from 'passport-local';
import userModel from '../dao/models/users.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
            const user = await userModel.findOne({ email: username });

            if (user) {
                console.log('user already exists');
                return done(null, false);
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            const result = await userModel.create(newUser);
            return done(null, result);

        } catch (error) {
            return done(`error registering user ${error}`);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });

            if (!user) {
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)
                        
            return done(null, user);
        } catch (error) {
            return done(`User login error ${error}`);
        }
    }));

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.7a3f5cac86242718',
        clientSecret: '11906866cbd9e6f06c1052d39ce7a581187330e7',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback'
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            const user = await userModel.findOne({ email: profile._json.email }); 
            if(!user){
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '', 
                    age: 0,
                    email: profile._json.email,
                    password: ''
                };

                const result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        }catch(error){
            done(error)
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });

};

export default initializePassport;
