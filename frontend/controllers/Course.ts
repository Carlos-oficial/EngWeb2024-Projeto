import { CourseDB } from '@/lib/types';
import Course from '@/models/Course';

export const list = () => {
  return Course.find().exec();
};

export const listIds = (ids: string[]) => {
  return Course.find({ _id: { $in: ids } }).exec();
};

export const get = (id: string) => {
  return Course.findById(id).exec();
};

export const create = (course: CourseDB) => {
  return Course.create(course);
};

export const update = (id: string, course: CourseDB) => {
  return Course.findByIdAndUpdate(id, course).exec();
};
