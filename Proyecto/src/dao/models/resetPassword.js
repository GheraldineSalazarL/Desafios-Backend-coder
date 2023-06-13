import mongoose from 'mongoose';

const resetPasswordCollection = 'resetPassword';

const resetPasswordSchema = new mongoose.Schema({
    user: {
      type: String,
      require: true,
    },
    token: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '1h',
    }
  });

export const resetPasswordModel = mongoose.model(resetPasswordCollection, resetPasswordSchema);