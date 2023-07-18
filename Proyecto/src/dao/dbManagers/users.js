import { resetPasswordModel } from "../models/resetPassword.js";
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

    saveResetPassword = async (resetPassword) => {
        const result = await resetPasswordModel.create(resetPassword);
        return result;
    }

    getUserResetPassword = async (userToken) => {
        const result = await resetPasswordModel.findOne({ token: userToken })
        return result;
    }

    updatePasswordUser = async (user, newPassword) => {
        const result = await userModel.updateOne({ _id: user._id }, { password: newPassword });
        return result;
    }

    deleteUserResetPassword = async (userId) => {
        const result = await resetPasswordModel.deleteOne({ user: userId });
        return result;
    }

    updateUserRol = async (uid, rol) => {
        const result = await userModel.updateOne({ _id: uid }, { rol: rol });
        return result;
    }

    getUsers = async () => {
        const users = await userModel.find();
        return users.map(user => user.toObject());
    }

    saveDocuments = async (uid, documents) => {
        const userUploaderDocuments = await userModel.findByIdAndUpdate(
            uid,
            {
                $push: {
                    documents: documents
                }
            },
            { new: true }
        );
        return userUploaderDocuments;
    }

    updateLastConnection = async (email) => {
        const result = await userModel.updateOne({ email: email }, { last_connection: new Date() });
        return result;
    }

    deleteUsers = async (id) => {
        const usersDelete = await userModel.deleteOne({ _id: id });
        return usersDelete;
    }

    updateCart = async (email, cart) => {
        const result = await userModel.updateOne({ email: email }, { cart: cart });
        return result;
    }
}
