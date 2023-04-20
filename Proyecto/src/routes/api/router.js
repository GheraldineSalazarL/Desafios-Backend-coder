// import jwt from 'jsonwebtoken';
import { Router as expressRouter } from 'express';
import passport from 'passport';

export default class Router {
    constructor() {
        this.router = expressRouter();
        this.init();
    }

    getRouter() {
        return this.router;
    }

    init() { }

    get(path, policies, passportStrategy, ...callbacks) {
        this.router.get(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    post(path, policies, passportStrategy, ...callbacks) {
        this.router.post(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    put(path, policies, passportStrategy, ...callbacks) {
        this.router.put(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    delete(path, policies, passportStrategy, ...callbacks) {
        this.router.delete(
            path,
            this.applyCustomPassportCall(passportStrategy),
            this.handlePolicies(policies),
            this.generateCustomResponse,
            this.applyCallbacks(callbacks)
        )
    }

    applyCustomPassportCall = (strategy) => (req, res, next) => {
        if (strategy === 'jwt') {
            passport.authenticate(strategy, function (err, user, info) {
                if (err) return next(error);

                if (!user) {
                    return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
                }
                console.log(user);
                req.user = user;
                next();
            })(req, res, next);
        } else {
            next();
        }
    }

    handlePolicies = (policies) => (req, res, next) => {
        if (policies[0] === "PUBLIC") return next();

        const user = req.user;

        if (!policies.includes(user.rol.toUpperCase()))
            return res.status(403).json({ error: 'Forbidden' });

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
        // res.sendForbbidenError = (error) => {
        //     res.status(403).json({ error });
        // };
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
                console.log(error);
                params[1].status(500).json({ error: error.message });
            }
        })
    }
}