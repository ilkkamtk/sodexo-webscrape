import mongoose from 'mongoose';
import { ActivationLink } from '../../interfaces/User';

const Schema = mongoose.Schema;

const activationLinkSchema = new Schema<ActivationLink>({
  createdAt: { type: Date, required: true },
  hash: { type: String, required: true },
});

export default mongoose.model<ActivationLink>(
  'ActivationLink',
  activationLinkSchema,
);
