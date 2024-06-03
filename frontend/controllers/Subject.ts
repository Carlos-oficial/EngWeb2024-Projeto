import { SubjectDB } from '@/lib/types';
import Subject from '@/models/Subject';

export const list = () => {
  return Subject.find().exec();
};

export const listByIds = (ids: string[]) => {
  return Subject.find({ _id: { $in: ids } }).exec();
};

export const get = (id: string) => {
  return Subject.findById(id).exec();
};

export const create = (subject: Partial<SubjectDB>) => {
  return Subject.create(subject);
};

export const update = (id: string, subject: Partial<SubjectDB>) => {
  return Subject.findByIdAndUpdate(id, subject).exec();
};
