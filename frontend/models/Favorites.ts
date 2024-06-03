import { model, models, Schema, Types } from 'mongoose';
import { any } from 'zod';

interface Favorites {
  userId: Types.ObjectId;
  resources: Types.ObjectId[];
}

const FavoritesSchema = new Schema<Favorites>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  resources: { type: [Schema.Types.ObjectId], ref: 'Resource' },
});

const Favorites =
  models.Favorites || model<Favorites>('Favorites', FavoritesSchema);

export default Favorites;
