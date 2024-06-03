import { model, models, Schema, Types } from 'mongoose';

interface FavoritesPerUser {
  userId: Types.ObjectId;
  resources: Types.ObjectId[];
}

const FavoritesPerUserSchema = new Schema<FavoritesPerUser>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  resources: { type: [Schema.Types.ObjectId], ref: 'Resource' },
});

const FavoritesPerUser = models.FavoritesPerUser || model<FavoritesPerUser>('FavoritesPerUser', FavoritesPerUserSchema);
export default FavoritesPerUser
