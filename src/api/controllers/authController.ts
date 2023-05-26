import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// TODO: Create login controller that creates a jwt token and returns it to the user

import { NextFunction, Request, Response } from 'express';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import { AuthUser, User, UserResponse } from '../../interfaces/User';
import { Types } from 'mongoose';

const login = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;
    const user = (await userModel.findOne({ username })) as User;
    console.log(user);
    if (!user) {
      next(new CustomError('Incorrect username/password', 200));
      return;
    }

    if (!bcrypt.compareSync(password, user.password)) {
      next(new CustomError('Incorrect username/password', 200));
      return;
    }

    const authUser: AuthUser = {
      username: user.username,
      favouriteRestaurant: user.favouriteRestaurant,
      _id: user._id as Types.ObjectId,
    };

    const token = jwt.sign(authUser, process.env.JWT_SECRET as string);

    const message: UserResponse = {
      message: 'Login successful',
      token,
      data: authUser,
    };

    res.json(message);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export { login };
