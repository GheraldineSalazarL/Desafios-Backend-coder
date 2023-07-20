import { Router as expressRouter } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from '../../config/config.js';

const PRIVATE_KEY = config.secret;
export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() { }

    get(path, policies, ...callbacks) {
        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    // applyCustomPassportCall = (strategy) => (req, res, next) => {
    //     if (strategy === 'jwt') {
    //         passport.authenticate(strategy, function (err, user, info) {
    //             if (err) return next(error);

    //             if (!user) {
    //                 return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
    //             }
    //             console.log(user);
    //             req.user = user;
    //             next();
    //         })(req, res, next);
    //     } else {
    //         next();
    //     }
    // }

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === "PUBLIC") return next();


        // ------------Middleware para verificar el token en las solicitudes posteriores---------------

        const authToken1 = req.headers["authorization"] || req.headers["Authorization"];
        const authToken2 = req.cookies.token;
        
        const token = ( authToken1 && authToken1.split(" ")[1] ) || authToken2;
            if(!token) return res.status(401).json({ message: 'Not token provided' })

        const user = jwt.verify(token, PRIVATE_KEY);
        if(!policies.includes(user.rol.toUpperCase())){
            res.status(403).json({ message: 'Forbidden', error: 'Forbidden'})
            return req.logger.error('Forbidden');
        }
        req.user = user;
        next();
    }

    generateCustomResponse = (req, res, next) => {
        res.sendSuccess = (data) => {
            res.status(200).json({ data });
        };
        res.sendServerError = (error) => {
            res.status(500).json({ error });
        };
        res.sendClientError = (error) => {
            res.status(400).json({ error });
        };
        res.sendForbbidenError = (error) => {
            res.status(403).json({ error });
        };
        // res.sendNotFoundError = (error) => {
        //     res.status(404).json({ error });
        // };
        next();
    }

    applyCallbacks(callbacks) {
        return callbacks.map((callback) => async (...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                // params[1].status(500).json({ error: error.message });
            }
        })
    }
}
