import { model, models, Schema, Types } from 'mongoose';

interface FavoritesPerResource_ {
  resourceId: Types.ObjectId;
  users: Types.ObjectId[];
}

const FavoritesPerResourceSchema = new Schema<FavoritesPerResource_>({
    resourceId: { type: Schema.Types.ObjectId, ref: 'Resource', unique: true },
    users: { type: [Schema.Types.ObjectId], ref: 'User' },
});

const FavoritesPerResource = models.FavoritesPerResource || model<FavoritesPerResource_>('FavoritesPerResource', FavoritesPerResourceSchema);
export default FavoritesPerResource
