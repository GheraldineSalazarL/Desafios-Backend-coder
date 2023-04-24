// import userModel from '../models/users.js'; 
import { userModel } from "../models/users.js"

export default class UsersManager {
    getByEmail = async (email) => {
        const user = await userModel.findOne({ email });
        return user;
    }

    saveUser = async (user) => {
        let result = await userModel.create(user);
        return result;
    }

    getById = async (id) => {
        const user = await userModel.findById(id);
        return user;
    }
}
