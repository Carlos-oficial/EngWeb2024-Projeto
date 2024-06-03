import { ResourceDB } from '@/lib/types';
import Resource from '@/models/Resource';

export const list = (query: any) => {
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
