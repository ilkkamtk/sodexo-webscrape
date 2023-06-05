import { Request, Response, NextFunction } from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {
  User,
  AuthUser,
  UserResponse,
  UpdateUser,
  ActivationLink,
} from '../../interfaces/User';
import userModel from '../models/userModel';
import activationLinkModel from '../models/activationLinkModel';
import Mail from '../../interfaces/Mail';
import sendMail from '../../functions/sendMail';
import MessageResponse from '../../interfaces/MessageResponse';
import fs from 'fs';

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

    // create activation link
    const activateObject: ActivationLink = {
      hash: bcrypt.hashSync(newUser.username, salt),
      createdAt: new Date(),
      user: newUser._id,
    };
    // save activation link
    const result = await activationLinkModel.create(activateObject);
    console.log(result);

    // send email
    const mail: Mail = {
      from: 'noreply@studentrestaurants.fi',
      to: newUser.email,
      subject: 'Account activation',
      html: `Click the link to activate your account: <a href="${
        user.UIUrl + activateObject.hash
      }">Activate</a>`,
    };
    // send email
    const link = await sendMail(mail);

    const response: UserResponse = {
      message: 'user created',
      data: {
        username: newUser.username,
        email: newUser.email,
        favouriteRestaurant: newUser.favouriteRestaurant,
        _id: newUser._id,
        role: newUser.role,
        activated: newUser.activated,
      },
      activationUrl: link,
    };

    res.json(response);
  } catch (error) {
    if ((error as Error).message.includes('11000')) {
      next(new CustomError('Username or email already exists', 400));
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
    // get previous avatar
    const currentData = await userModel.findById(userFromToken._id);
    const currentAvatar = currentData?.avatar;
    if (req.file) {
      const avatarFile = req.file.filename;
      const result = await userModel.findByIdAndUpdate(
        userFromToken._id,
        { avatar: avatarFile },
        { new: true },
      );
      if (result) {
        // delete previous avatar
        if (currentAvatar) {
          const path = `${__dirname}/../../../uploads/${currentAvatar}`;
          fs.unlink(path, (err) => {
            if (err) {
              console.error(err);
              return;
            }
          });
        }
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

const activateUser = async (
  req: Request<{ hash: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const hash = req.params.hash;
    console.log(hash);
    const activateLink = await activationLinkModel.findOne({
      hash: hash,
    });
    console.log(activateLink);
    if (activateLink === null) {
      next(new CustomError('Activation link not found', 404));
      return;
    }

    const user = await userModel.findByIdAndUpdate(
      activateLink.user,
      { activated: true },
      { new: true },
    );
    if (user) {
      const message: MessageResponse = {
        message: 'User activated',
      };
      res.json(message);
      activationLinkModel.findByIdAndDelete(activateLink._id);
    } else {
      next(new CustomError('User not found', 404));
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
  activateUser,
};
