import express from 'express';
import restaurantRoute from './routes/restaurantRoute';
import userRoute from './routes/userRoute';
import authRoute from './routes/authRoute';

import MessageResponse from '../interfaces/MessageResponse';
// import { populateRestaurants } from './controllers/populateController';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - V1',
  });
});

router.use('/restaurants', restaurantRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);

// run once to populate database:
// router.use('/populate', populateRestaurants);

export default router;
