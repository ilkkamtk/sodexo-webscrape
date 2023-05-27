import { Document, Types } from 'mongoose';
interface User extends Document {
  username: string;
  password: string;
  favouriteRestaurant?: Types.ObjectId;
  avatar?: string;
  role: 'admin' | 'user';
}

type UpdateUser = Partial<User>;

interface AuthUser {
  username: string;
  favouriteRestaurant?: Types.ObjectId;
  _id: Types.ObjectId;
  avatar?: string;
  role: 'admin' | 'user';
}

interface UserResponse {
  message: string;
  data: {
    username: string;
    favouriteRestaurant?: Types.ObjectId;
    _id: Types.ObjectId;
    avatar?: string;
    role: 'admin' | 'user';
  };
  token?: string;
}

export { User, UpdateUser, AuthUser, UserResponse };
