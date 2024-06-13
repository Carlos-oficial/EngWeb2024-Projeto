import { model, models, Schema } from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string;
  image: string;
  emailVerified: Date | null;
  isAdmin: boolean;
  favoritedResourceIds: string[];
  upvotedResourceIds: string[];
  downvotedResourceIds: string[];
}

const ResourceSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  emailVerified: { type: Date },
  isAdmin: { type: Boolean, default: false },
  favoritedResourceIds: { type: [String], default: [] },
  upvotedResourceIds: { type: [String], default: [] },
  downvotedResourceIds: { type: [String], default: [] },
});

const User = models.User || model<User>('User', ResourceSchema);

export default User;
