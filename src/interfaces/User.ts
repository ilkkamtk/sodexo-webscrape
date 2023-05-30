import { Document, Types } from 'mongoose';
interface User extends Document {
  username: string;
  email: string;
  password: string;
  favouriteRestaurant?: Types.ObjectId;
  avatar?: string;
  role: 'admin' | 'user';
  activated: boolean;
  UIUrl?: string;
}

type UpdateUser = Partial<User>;

interface AuthUser {
  username: string;
  email: string;
  favouriteRestaurant?: Types.ObjectId;
  _id: Types.ObjectId;
  avatar?: string;
  role: 'admin' | 'user';
  activated: boolean;
}

interface UserResponse {
  message: string;
  data: {
    username: string;
    email: string;
    favouriteRestaurant?: Types.ObjectId;
    _id: Types.ObjectId;
    avatar?: string;
    role: 'admin' | 'user';
    activated: boolean;
  };
  token?: string;
}

interface ActivationLink {
  hash: string;
  createdAt: Date;
}

export { User, UpdateUser, AuthUser, UserResponse, ActivationLink };
