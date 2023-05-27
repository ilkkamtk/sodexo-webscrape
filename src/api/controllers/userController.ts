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
      next(new CustomError('User not found', 404));
      return;
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
    user.role = 'user';
    user.password = bcrypt.hashSync(user.password, salt);
    console.log(user);
    const newUser = await userModel.create(user);
    const response: UserResponse = {
      message: 'user created',
      data: {
        username: newUser.username,
        favouriteRestaurant: newUser.favouriteRestaurant,
        _id: newUser._id,
        role: newUser.role,
      },
    };
    res.json(response);
  } catch (error) {
    if ((error as Error).message.includes('11000')) {
      next(new CustomError('Username already exists', 400));
      return;
    }
    next(new CustomError((error as Error).message, 400));
  }
};

const checkUserExists = async (
  req: Request<{ username: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (await userModel.findOne({ username: req.params.username })) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
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

const avatarPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userFromToken = res.locals.user;
    if (req.file) {
      const avatarFile = req.file.filename;
      const result = await userModel.findByIdAndUpdate(
        userFromToken._id,
        { avatar: avatarFile },
        { new: true },
      );
      if (result) {
        const response: UserResponse = {
          message: 'avatar uploaded',
          data: result,
        };
        res.json(response);
      }
    } else {
      next(new CustomError('No file uploaded', 400));
      return;
    }
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

export {
  userGet,
  userPost,
  userPutCurrent,
  userDeleteCurrent,
  checkToken,
  checkUserExists,
  avatarPost,
};
