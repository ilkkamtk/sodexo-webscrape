import express from 'express';
import {
  getDailyMenu,
  getRestaurant,
  getRestaurants,
  getWeeklyMenu,
} from '../controllers/restaurantController';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.route('/').get(getRestaurants);

router.route('/favourites').get(authenticate, getRestaurant);

router.route('/daily/:id/:lang').get(getDailyMenu);

router.route('/weekly/:id/:lang').get(getWeeklyMenu);

export default router;
