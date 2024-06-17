import { CommentDB } from '@/lib/types';
import Comment from '@/models/Comment';

export const list = () => {
  return Comment.find().exec();
};

export const listByIds = (ids: string[]) => {
  return Comment.find({ _id: { $in: ids } }).exec();
};

export const get = (id: string) => {
  return Comment.findById(id).exec();
};

export const create = (comment: Partial<CommentDB>) => {
  return Comment.create(comment);
};

export const remove = (id: string) => {
  return Comment.deleteOne({ _id: id }).exec();
};

export const update = (id: string, comment: Partial<CommentDB>) => {
  return Comment.findByIdAndUpdate(id, comment).exec();
};

export const getResourceComments = (resourceId: string) => {
  return Comment.find({ resourceId: resourceId }).sort({ createdAt: 1 }).exec();
};

export const getUserComments = (userEmail: string) => {
  return Comment.find({ userEmail: userEmail }).exec();
};
