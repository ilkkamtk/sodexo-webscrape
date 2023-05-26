import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {
  User,
  AuthUser,
  UserResponse,
  UpdateUser,
} from '../../interfaces/User';
import userModel from '../models/userModel';
declare module 'express-serve-static-core' {
  interface ParamsDictionary {
    id: string;
  }
}

const salt = bcrypt.genSaltSync(12);

const userListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userModel.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      throw new CustomError('User not found', 404);
    }
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

const userPost = async (
  req: Request<{}, {}, User>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, salt);
    console.log(user);
    const newUser = await userModel.create(user);
    const response: UserResponse = {
      message: 'user created',
      data: {
        username: newUser.username,
        favouriteRestaurant: newUser.favouriteRestaurant,
        _id: newUser._id,
      },
    };
    res.json(response);
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

const userPutCurrent = async (
  req: Request<{}, {}, UpdateUser>,
  res: Response<{}, { user: AuthUser }>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;
    const user = req.body;
    const result = await userModel
      .findByIdAndUpdate(userFromToken._id, user, {
        new: true,
      })
      .select('-password');
    if (result) {
      const response: UserResponse = {
        message: 'user modified',
        data: result,
      };
      res.json(response);
    }
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

const userDeleteCurrent = async (
  req: Request,
  res: Response<{}, { user: AuthUser }>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;
    const result = await userModel
      .findByIdAndDelete(userFromToken._id)
      .select('-password');
    if (result) {
      const response: UserResponse = {
        message: 'user deleted',
        data: result,
      };
      res.json(response);
    }
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const userFromToken = res.locals.user;
  if (!userFromToken) {
    next(new CustomError('token not valid', 403));
  } else {
    req.params.id = userFromToken._id;
    userGet(req, res, next);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPutCurrent,
  userDeleteCurrent,
  checkToken,
};
