import { model, models, Schema, Types } from 'mongoose';
import { any } from 'zod';

interface User {
    name: string;
    email: string;
    image: string;
    emailVerified: any; // idk
}

const ResourceSchema = new Schema<User>({
    name: {type: String},
    email: {type: String, unique: true},
    image: {type: String},
    emailVerified: {type: any}, // idk
});

const User = models.User || model<User>('User', ResourceSchema);

export default User;
