// import userModel from '../models/users.js'; 
import { resetPasswordModel } from "../models/resetPassword.js";
import { userModel } from "../models/users.js"

export default class UsersManager {
    getByEmail = async (email) => {
        const user = await userModel.findOne({ email });
        return user;
    }

    saveUser = async (user) => {
        let result = await userModel.create(user);
        // req.logger.info('Actualización de base de datos USER realizada');
        return result;
    }

    getById = async (id) => {
        const user = await userModel.findById(id);
        return user;
    }

    saveResetPassword = async (resetPassword) => {
        const result = await resetPasswordModel.create(resetPassword);
        return result;
    }

    getUserResetPassword = async(userToken) => {
        const result = await resetPasswordModel.findOne({token:userToken})
        return result;
    }

    updatePasswordUser = async (userDB, newPassword) => {
        const result = await userModel.updateOne({ _id: userDB._id }, { password: newPassword});
        return result;
    }

    deleteUserResetPassword = async (userId) => {
        const result = await resetPasswordModel.deleteOne({user:userId});
        return result;
    }

    updateUserRol = async (uid, rol) => {
        const result = await userModel.updateOne({ _id: uid }, { rol: rol});
        return result;
    }
}
