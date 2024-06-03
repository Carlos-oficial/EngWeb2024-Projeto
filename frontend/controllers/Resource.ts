import { ResourceDB } from '@/lib/types';
import FavoritesPerResource from '@/models/FavoritesPerResource';
import Resource from '@/models/Resource';
import mongoose from 'mongoose';

export const list = (query: mongoose.FilterQuery<ResourceDB>) => {
  return Resource.find(query).exec();
};

export const listIds = (ids: string[]) => {
  return Resource.find({ _id: { $in: ids } }).exec();
};

export const listbyUser = (email: string) => {
  return Resource.find({ userEmail: email }).exec();
};

export const get = (id: string) => {
  return Resource.findById(id).exec();
};

export const create = (resource: Partial<ResourceDB>) => {
  return Resource.create(resource);
};

export const update = (id: string, resource: Partial<ResourceDB>) => {
  return Resource.findByIdAndUpdate(id, resource).exec();
};

export const remove = (id: string) => {
  return Resource.findByIdAndDelete(id).exec();
};

export const getFavorites = (id: string) => {
  return FavoritesPerResource.findOne({ resourceId: id }).exec();
};
