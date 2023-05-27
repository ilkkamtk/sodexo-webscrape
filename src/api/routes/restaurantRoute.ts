import express from 'express';
import {
  deleteRestaurant,
  getDailyMenu,
  getRestaurant,
  getRestaurants,
  getWeeklyMenu,
} from '../controllers/restaurantController';
import { authenticate } from '../../middlewares';

const router = express.Router();

router.route('/').get(getRestaurants);

router.route('/daily/:id/:lang').get(getDailyMenu);

router.route('/weekly/:id/:lang').get(getWeeklyMenu);

router.route('/:id').get(getRestaurant).delete(authenticate, deleteRestaurant);

export default router;
