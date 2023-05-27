import { Request, Response, NextFunction } from 'express';
import {
  scrapeCompassDailyMenu,
  scrapeCompassWeeklyMenu,
  scrapeSodexoDailyMenu,
  scrapeSodexoWeeklyMenu,
} from '../../functions/scrapingFunctions';
import CustomError from '../../classes/CustomError';
import { Course, DailyMenu, WeeklyMenu } from '../../interfaces/Restaurant';
import { AuthUser } from '../../interfaces/User';
import restaurantModel from '../models/restaurantModel';
import MessageResponse from '../../interfaces/MessageResponse';
import { Meal } from '../../interfaces/Compass';

const getRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const restaurants = await restaurantModel.find();
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
    // select correct scraper based on restaurant id
    const restaurant = await restaurantModel.findById(req.params.id);
    if (!restaurant) {
      next(new CustomError('Restaurant not found', 404));
      return;
    }

    let menu: DailyMenu;

    if (restaurant.company === 'Sodexo') {
      const sodexoMenu = await scrapeSodexoDailyMenu(
        restaurant.companyId,
        req.params.lang,
      );

      console.log(sodexoMenu);
      // convert sodexoMenu.courses to array of Course objects
      if (!sodexoMenu.courses) {
        next(new CustomError('No food today', 404));
        return;
      }
      const sodexoCourses = Object.values(sodexoMenu.courses);

      menu = {
        courses: sodexoCourses.map((course) => ({
          name: req.params.lang === 'en' ? course.title_en : course.title_fi,
          price: course.price,
          diets: course.dietcodes,
        })),
      };
    } else {
      const compassMenu = await scrapeCompassDailyMenu(
        restaurant.companyId,
        req.params.lang,
      );

      console.log(compassMenu);

      const meals: Course[] = compassMenu.menuPackages.reduce(
        (result: any, menuPackage) => {
          const packageMeals = menuPackage.meals.map((meal) => meal);
          return result.concat(packageMeals);
        },
        [],
      );

      console.log(meals);

      menu = {
        courses: meals.map((meal) => ({
          name: meal.name,
          price: meal.price,
          diets: meal.diets,
        })),
      };
    }
    res.json(menu);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getWeeklyMenu = async (
  req: Request<{ id: string; lang: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // select correct scraper based on restaurant id
    const restaurant = await restaurantModel.findById(req.params.id);
    if (!restaurant) {
      next(new CustomError('Restaurant not found', 404));
      return;
    }
    let menu: WeeklyMenu;

    if (restaurant.company === 'Sodexo') {
      const swm = await scrapeSodexoWeeklyMenu(
        restaurant.companyId,
        req.params.lang,
      );
      menu = {
        days: swm.mealdates.map((day) => ({
          date: day.date,
          courses: Object.values(day.courses).map((course) => ({
            name: req.params.lang === 'en' ? course.title_en : course.title_fi,
            price: course.price,
            diets: course.dietcodes,
          })),
        })),
      };
    } else {
      const cwm = await scrapeCompassWeeklyMenu(
        restaurant.companyId,
        req.params.lang,
      );
      menu = {
        days: cwm.menus.map((menuPackage) => ({
          date: menuPackage.dayOfWeek,
          courses: menuPackage.menuPackages
            .reduce((result: any, menuP) => {
              const packageMeals = menuP.meals.map((meal) => meal);
              // add price
              packageMeals.forEach((meal: Meal) => {
                meal.price = menuP.price;
              });
              return result.concat(packageMeals);
            }, [])
            .map((meal: Meal) => ({
              name: meal.name,
              price: meal.price,
              diets: meal.diets,
            })),
        })),
      };
    }
    res.json(menu);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const getRestaurant = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const restaurant = await restaurantModel.findById(req.params.id);
    if (!restaurant) {
      next(new CustomError('Restaurant not found', 404));
      return;
    }
    res.json(restaurant);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

const deleteRestaurant = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response<{}, { user: AuthUser }>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;
    if (userFromToken.role !== 'admin') {
      next(new CustomError('Unauthorized', 401));
      return;
    }
    console.log(req.params.id);
    const restaurant = await restaurantModel.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      next(new CustomError('Restaurant not found', 404));
      return;
    }
    const message: MessageResponse = {
      message: 'Restaurant deleted',
    };
    res.json(message);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  getRestaurants,
  getDailyMenu,
  getWeeklyMenu,
  getRestaurant,
  deleteRestaurant,
};
