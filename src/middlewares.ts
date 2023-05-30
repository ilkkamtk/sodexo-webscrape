/* eslint-disable @typescript-eslint/indent */
import { NextFunction, Request, Response } from 'express';

import ErrorResponse from './interfaces/ErrorResponse';
import CustomError from './classes/CustomError';
import { AnyZodObject } from 'zod';
import jwt from 'jsonwebtoken';
import { AuthUser, User } from './interfaces/User';
import userModel from './api/models/userModel';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // console.log('errorhanler', err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const token = bearer.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const userFromToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as User;

    console.log(userFromToken);
    const user = await userModel
      .findById(userFromToken._id)
      .select('-password');

    if (!user) {
      next(new CustomError('Token not valid', 403));
      return;
    }

    const authUser: AuthUser = {
      _id: user._id,
      username: user.username,
      favouriteRestaurant: user.favouriteRestaurant,
      role: user.role,
      email: user.email,
      activated: user.activated,
    };

    res.locals.user = authUser;

    next();
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

export { notFound, errorHandler, validate, authenticate };
