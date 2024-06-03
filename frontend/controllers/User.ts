import { UserDB } from '@/lib/types';
import Favorites from '@/models/Favorites';
import User from '@/models/User';

export const list = () => {
  return User.find().exec();
};

export const listIds = (ids: string[]) => {
  return User.find({ _id: { $in: ids } }).exec();
};

export const get = (email: string) => {
  return User.findOne({ email: email }).exec();
};

export const create = (subject: UserDB) => {
  return User.create(subject);
};

export const update = (email: string, subject: UserDB) => {
  return User.findOneAndUpdate({ userEmail: email }, subject).exec();
};

export const getFavorites = (email: string) => {
  return Favorites.findOne({ userEmail: email }).exec();
};

export const postFavorites = (email: string, list: string[]) => {
  return Favorites.updateOne(
    { userEmail: email },
    { $set: { resources: list } },
    { upsert: true },
  ).exec();
};

export const addFavorite = (email: string, fav: string) => {
  return Favorites.updateOne(
    { userEmail: email },
    { $push: { resources: fav } },
    { upsert: true },
  ).exec();
};

export const rmFavorite = (email: string, fav: string) => {
  return Favorites.updateOne(
    { userEmail: email },
    { $pop: { resources: fav } },
    { upsert: true },
  ).exec();
};
