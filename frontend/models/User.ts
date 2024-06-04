import { model, models, Schema } from 'mongoose';

interface User {
  name: string;
  email: string;
  password: string; // for local users
  image: string;
  emailVerified: Date | null;
}

const ResourceSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  image: { type: String },
  emailVerified: { type: Date },
});

const User = models.User || model<User>('User', ResourceSchema);

export default User;
