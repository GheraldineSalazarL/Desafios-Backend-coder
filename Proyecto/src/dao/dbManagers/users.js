// import userModel from '../models/users.js'; 
import { userModel } from "../models/users.js"

export default class UsersManager {
    getByEmail = async (email) => {
        const user = await userModel.findOne({ email });
        return user;
    }

    saveUser = async (user) => {
        let result = await userModel.create(user);
        req.logger.info('Actualización de base de datos USER realizada');
        return result;
    }

    getById = async (id) => {
        const user = await userModel.findById(id);
        return user;
    }
}
