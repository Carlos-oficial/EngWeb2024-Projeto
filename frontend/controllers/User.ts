import { UserDB } from '@/lib/types';
import Resource from '@/models/Resource';
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

export const getInteractions = (email: string) => {
  return User.findOne({ email: email })
    .select('favoritedResourceIds upvotedResourceIds downvotedResourceIds')
    .exec();
};

export const getFavorites = (email: string) => {
  return User.findOne({ email: email }).select('favoritedResourceIds').exec();
};

export const getUpvotes = (email: string) => {
  return User.findOne({ email: email }).select('upvotedResourceIds').exec();
};

export const getDownvotes = (email: string) => {
  return User.findOne({ email: email }).select('downvotedResourceIds').exec();
};

export const addFavorite = async (email: string, resourceId: string) => {
  await User.updateOne(
    { email: email },
    { $push: { favoritedResourceIds: resourceId } },
  ).exec();

  await Resource.updateOne(
    { _id: resourceId },
    { $inc: { favoritesNr: 1 } },
  ).exec();
};

export const removeFavorite = async (email: string, resourceId: string) => {
  await User.updateOne(
    { email: email },
    { $pull: { favoritedResourceIds: resourceId } },
  ).exec();

  await Resource.updateOne(
    { _id: resourceId },
    { $inc: { favoritesNr: -1 } },
  ).exec();
};

export const addUpvote = async (email: string, resourceId: string) => {
  await User.updateOne(
    { email: email },
    { $push: { upvotedResourceIds: resourceId } },
  ).exec();

  await Resource.updateOne(
    { _id: resourceId },
    { $inc: { upvotesNr: 1 } },
  ).exec();
};

export const removeUpvote = async (email: string, resourceId: string) => {
  await User.updateOne(
    { email: email },
    { $pull: { upvotedResourceIds: resourceId } },
  ).exec();

  await Resource.updateOne(
    { _id: resourceId },
    { $inc: { upvotesNr: -1 } },
  ).exec();
};

export const addDownvote = async (email: string, resourceId: string) => {
  await User.updateOne(
    { email: email },
    { $push: { downvotedResourceIds: resourceId } },
  ).exec();

  await Resource.updateOne(
    { _id: resourceId },
    { $inc: { downvotesNr: 1 } },
  ).exec();
};

export const removeDownvote = async (email: string, resourceId: string) => {
  await User.updateOne(
    { email: email },
    { $pull: { downvotedResourceIds: resourceId } },
  ).exec();

  await Resource.updateOne(
    { _id: resourceId },
    { $inc: { downvotesNr: -1 } },
  ).exec();
};
