import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.model.js';

export const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
  },
  surname: {
    type: String,
    required: true,
    unique: true,
  },
  probada: [{ type: Schema.Types.ObjectId, ref: 'Beer' }],
});

userSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const UserModel = model('Users', userSchema, 'user');
