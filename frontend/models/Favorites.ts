import { model, models, Schema, Types } from 'mongoose';

interface Favorites {
  userEmail: string;
  resources: Types.ObjectId[];
}

const FavoritesSchema = new Schema<Favorites>({
  userEmail: { type: String, ref: 'User', unique: true },
  resources: { type: [Schema.Types.ObjectId], ref: 'Resource' },
});

const Favorites =
  models.Favorites || model<Favorites>('Favorites', FavoritesSchema);

export default Favorites;
