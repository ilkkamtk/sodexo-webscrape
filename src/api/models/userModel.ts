import mongoose from 'mongoose';
import { User } from '../../interfaces/User';

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favouriteRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  avatar: { type: String },
  role: { type: String, required: true, enum: ['admin', 'user'] },
});

export default mongoose.model<User>('User', userSchema);
