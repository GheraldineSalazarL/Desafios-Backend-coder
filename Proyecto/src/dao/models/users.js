import mongoose from 'mongoose';

const userCollection = 'users';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String
});

const userModel = mongoose.model(userCollection, schema);

export default userModel;