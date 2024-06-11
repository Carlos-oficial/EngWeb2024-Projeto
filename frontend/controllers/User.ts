import { UserDB } from '@/lib/types';
import FavoritesPerResource from '@/models/FavoritesPerResource';
import FavoritesPerUser from '@/models/FavoritesPerUser';
import User from '@/models/User';

export const list = () => {
  return User.find().exec();
};

export const listByEmails = (emails: string[]) => {
  return User.find({ email: { $in: emails } }).exec();
};

export const get = (email: string) => {
  return User.findOne({ email: email }).exec();
};

export const create = (subject: Partial<UserDB>) => {
  return User.create(subject);
};

export const update = (email: string, subject: Partial<UserDB>) => {
  return User.findOneAndUpdate({ userEmail: email }, subject).exec();
};

export const getFavorites = (email: string) => {
  return FavoritesPerUser.findOne({ userEmail: email }).exec();
};

export const listFavorites = () => {
  return FavoritesPerUser.find().exec();
};

export const postFavorites = (email: string, list: string[]) => {
  return FavoritesPerUser.updateOne(
    { userEmail: email },
    { $set: { resourceIds: list } },
    { upsert: true },
  ).exec();
};

export const addFavorite = async (email: string, resourceId: string) => {
  await FavoritesPerResource.updateOne(
    { resourceId: resourceId },
    { $push: { userEmails: email } },
    { upsert: true },
  ).exec();

  return FavoritesPerUser.updateOne(
    { userEmail: email },
    { $push: { resourceIds: resourceId } },
    { upsert: true },
  ).exec();
};

export const removeFavorite = async (email: string, resourceId: string) => {
  await FavoritesPerResource.updateOne(
    { resourceId: resourceId },
    { $pull: { userEmails: email } },
    { upsert: true },
  ).exec();

  return FavoritesPerUser.updateOne(
    { userEmail: email },
    { $pull: { resourceIds: resourceId } },
  ).exec();
};
