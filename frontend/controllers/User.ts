import { UserDB } from '@/lib/types';
import User from '@/models/User';

export const list = () => {
  return User.find().exec();
};

export const listIds = (ids: string[]) => {
  return User.find({ _id: { $in: ids } }).exec();
};

export const get = (id: string) => {
  return User.findById(id).exec();
};

export const create = (subject: UserDB) => {
  return User.create(subject);
};

export const update = (id: string, subject: UserDB) => {
  return User.findByIdAndUpdate(id, subject).exec();
};
