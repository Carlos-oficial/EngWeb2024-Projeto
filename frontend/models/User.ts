import { model, models, Schema } from 'mongoose';

interface User {
  name: string;
  email: string;
  image: string;
  emailVerified: Date | null; // idk
}

const ResourceSchema = new Schema<User>({
  name: { type: String },
  email: { type: String, unique: true },
  image: { type: String },
  emailVerified: { type: Date }, // idk
});

const User = models.User || model<User>('User', ResourceSchema);

export default User;
