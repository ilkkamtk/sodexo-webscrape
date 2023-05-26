import { Request, Response, NextFunction } from 'express';
import {
  scrapeSodexoDailyMenu,
  scrapeSodexoWeeklyMenu,
} from '../../functions/scrapingFunctions';
import CustomError from '../../classes/CustomError';
import { DailyMenu } from '../../interfaces/Restaurant';
import { AuthUser } from '../../interfaces/User';
import restaurantModel from '../models/restaurantModel';

const getRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const restaurants = restaurantModel.find();
    res.json(restaurants);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getDailyMenu = async (
  req: Request<{ id: number; lang: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sodexoMenu = await scrapeSodexoDailyMenu(
      req.params.id,
      req.params.lang,
    );

    // convert sodexoMenu.courses to array of Course objects
    const sodexoCourses = Object.values(sodexoMenu.courses);

    const menu: DailyMenu = {
      courses: sodexoCourses.map((course) => ({
        name: req.params.lang === 'en' ? course.title_en : course.title_fi,
        price: course.price,
        diets: course.dietcodes,
      })),
    };
    res.json(menu);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getWeeklyMenu = async (
  req: Request<{ id: number; lang: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const menu = await scrapeSodexoWeeklyMenu(req.params.id, req.params.lang);
    res.json(menu);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getRestaurant = async (
  req: Request,
  res: Response<{}, { user: AuthUser }>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;
    const restaurant = await restaurantModel.findById(
      userFromToken.favouriteRestaurant,
    );
    if (!restaurant) {
      throw new CustomError('Restaurant not found', 404);
    }
    res.json(restaurant);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export { getRestaurants, getDailyMenu, getWeeklyMenu, getRestaurant };
