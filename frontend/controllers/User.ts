import { UserDB } from '@/lib/types';
import Favorites from '@/models/Favorites';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export const list = () => {
  return User.find().exec();
};

export const listIds = (ids: string[]) => {
  return User.find({ _id: { $in: ids } }).exec();
};

export const get = (id: string) => {
  console.log(id)
  return User.findOne({_id:new ObjectId(id)}).exec();
};

export const create = (subject: UserDB) => {
  return User.create(subject);
};

export const update = (id: string, subject: UserDB) => {
  return User.findByIdAndUpdate(id, subject).exec();
};

export const getFavorites = (id: string) => {
  return Favorites.findOne({userId:id}).exec();
};

