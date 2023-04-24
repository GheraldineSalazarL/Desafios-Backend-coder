import mongoose from 'mongoose';

const userCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: {
      type: String,
      require: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    age:{
        type: Number,
        require: true,
    },
    password: {
      type: String,
      require: true,
    },
    rol: {
      type: String,
      require: true,
      default: 'user',
    }
  });
// const userModel = mongoose.model(userCollection, usersSchema);

// export default userModel;

export const userModel = mongoose.model(userCollection, usersSchema);