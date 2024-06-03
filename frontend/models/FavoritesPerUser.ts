import { model, models, Schema, Types } from 'mongoose';

interface FavoritesPerUser {
  userEmail: string;
  resources: Types.ObjectId[];
}

const FavoritesPerUserSchema = new Schema<FavoritesPerUser>({
  userEmail: { type: String, ref: 'User', unique: true },
  resources: { type: [Schema.Types.ObjectId], ref: 'Resource' },
});

const FavoritesPerUser = models.FavoritesPerUser || model<FavoritesPerUser>('FavoritesPerUser', FavoritesPerUserSchema);
export default FavoritesPerUser
