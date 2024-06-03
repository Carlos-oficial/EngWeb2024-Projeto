import { model, models, Schema, Types } from 'mongoose';

interface FavoritesPerUser {
  userEmail: string;
  resourceIds: Types.ObjectId[];
}

const FavoritesPerUserSchema = new Schema<FavoritesPerUser>({
  userEmail: { type: String, ref: 'User', unique: true },
  resourceIds: { type: [Schema.Types.ObjectId], ref: 'Resource' },
});

const FavoritesPerUser =
  models.FavoritesPerUser ||
  model<FavoritesPerUser>('FavoritesPerUser', FavoritesPerUserSchema);
export default FavoritesPerUser;
