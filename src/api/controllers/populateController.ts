import { NextFunction, Request, Response } from 'express';
import {
  scrapeCompassRestaurants,
  scrapeSodexoRestaurants,
} from '../../functions/scrapingFunctions';
import restaurantModel from '../models/restaurantModel';
import CustomError from '../../classes/CustomError';
import { Restaurant } from '../../interfaces/Restaurant';

const populateRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const restaurants = await scrapeSodexoRestaurants();
    restaurants.forEach((restaurant) => {
      const newRestaurant = new restaurantModel(restaurant);
      newRestaurant.save();
    });

    const compassRestaurants = await scrapeCompassRestaurants();
    compassRestaurants.forEach((restaurant) => {
      const newRestaurant: Restaurant = {
        name: restaurant.title,
        address: restaurant.streetAddress,
        postalCode: restaurant.postalCode,
        city: restaurant.city,
        phone: '-',
        location: {
          type: 'Point',
          coordinates: [
            restaurant.coordinates.longitude,
            restaurant.coordinates.latitude,
          ],
        },
        company: 'Compass Group',
        companyId: restaurant.contentId,
      };
      console.log(newRestaurant);
      const newCompassRestaurant = new restaurantModel(newRestaurant);
      newCompassRestaurant.save();
    });

    const dbResult = await restaurantModel.find();
    res.json(dbResult);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export { populateRestaurants };
