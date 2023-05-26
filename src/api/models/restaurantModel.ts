import mongoose from 'mongoose';
import { Restaurant } from '../../interfaces/Restaurant';

const Schema = mongoose.Schema;

const restaurantSchema = new Schema<Restaurant>({
  companyId: { type: Number, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  company: { type: String, required: true },
});

export default mongoose.model<Restaurant>('Restaurant', restaurantSchema);
