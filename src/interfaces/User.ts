import { Document, Types } from 'mongoose';
interface User extends Document {
  username: string;
  password: string;
  favouriteRestaurant?: Types.ObjectId;
  avatar?: string;
}

type UpdateUser = Partial<User>;

interface AuthUser {
  username: string;
  favouriteRestaurant?: Types.ObjectId;
  _id: Types.ObjectId;
  avatar?: string;
}

interface UserResponse {
  message: string;
  data: {
    username: string;
    favouriteRestaurant?: Types.ObjectId;
    _id: Types.ObjectId;
    avatar?: string;
  };
  token?: string;
}

export { User, UpdateUser, AuthUser, UserResponse };
