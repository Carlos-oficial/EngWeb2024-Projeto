import { UserDB } from '@/lib/types';
import FavoritesPerResource from '@/models/FavoritesPerResource';
import FavoritesPerUser from '@/models/FavoritesPerUser';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export const list = () => {
  return User.find().exec();
};

export const listIds = (ids: string[]) => {
  return User.find({ _id: { $in: ids } }).exec();
};

export const get = (id: string) => {
  console.log(id);
  return User.findOne({ _id: new ObjectId(id) }).exec();
};

export const create = (subject: UserDB) => {
  return User.create(subject);
};

export const update = (id: string, subject: UserDB) => {
  return User.findByIdAndUpdate(id, subject).exec();
};

export const getFavorites = (id: string) => {
  return FavoritesPerUser.findOne({ userId: id }).exec();
};

export const postFavorites = (id: string,list:string[]) => {

  return FavoritesPerUser.updateOne({ userId: id },{$set : {resources : list}},{ upsert: true }).exec();
};

export const addFavorite = (id: string,fav:string) => {
  FavoritesPerResource.updateOne({ resourceId: fav},{$push : {users : id}} , { upsert: true }).exec()
  return FavoritesPerUser.updateOne({ userId: id },{$push : {resources : fav}} , { upsert: true }).exec();
};

export const rmFavorite = (id: string,fav:string) => {
  FavoritesPerResource.updateOne({ resourceId: fav},{$pull : {users : id}} , { upsert: true }).exec()
  return FavoritesPerUser.updateOne({ userId: id },{$pull : {resources : fav}}).exec();
};
