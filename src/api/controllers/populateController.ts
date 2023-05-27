import { NextFunction, Request, Response } from 'express';
import {
  getCompassCostCenterId,
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
    for (const restaurant of restaurants) {
      try {
        const newRestaurant = new restaurantModel(restaurant);
        await newRestaurant.save();
      } catch (error) {
        console.log('Restaurant already exists:', restaurant?.name);
        continue;
      }
    }

    const compassRestaurants = await scrapeCompassRestaurants();
    await Promise.all(
      compassRestaurants.map(async (restaurant) => {
        try {
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
            companyId: await getCompassCostCenterId(restaurant.url),
          };
          const newCompassRestaurant = new restaurantModel(newRestaurant);
          await newCompassRestaurant.save();
        } catch (error) {
          console.log('Restaurant already exists:', restaurant.title);
        }
      }),
    );
    const dbResult = await restaurantModel.find();
    res.json(dbResult);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export { populateRestaurants };
