import { ResourceDB, UserDB } from '@/lib/types';
import Resource from '@/models/Resource';
import { getSkip } from '@/lib/utils';
import { config } from '@/lib/config';

function matchCriteria(user: Pick<UserDB, 'email' | 'isAdmin'>) {
  if (!user.isAdmin) {
    return {
      $or: [{ userEmail: user.email }, { isVisible: true }],
    };
  } else {
    return {};
  }
}

export const listAll = (page: number) => {
  return Resource.find()
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(config.pages.PAGE_SIZE)
    .exec();
};

export const listPopular = (
  user: Pick<UserDB, 'email' | 'isAdmin'>,
  page: number,
) => {
  return Resource.aggregate([
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'resourceId',
        as: 'comments',
      },
    },
    {
      $match: matchCriteria(user),
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        documentTypeId: 1,
        documentFormat: 1,
        hashtags: 1,
        subjectId: 1,
        courseId: 1,
        createdAt: 1,
        userEmail: 1,
        favoritesNr: 1,
        upvotesNr: 1,
        downvotesNr: 1,
        downloadsNr: 1,
        edited: 1,
        isVisible: 1,
        isLocked: 1,
        popularity: {
          $add: [
            {
              $multiply: ['$upvotesNr', config.popularity.UPVOTE_FACTOR],
            },
            {
              $multiply: ['$downvotesNr', config.popularity.DOWNVOTE_FACTOR],
            },
            {
              $multiply: ['$favoritesNr', config.popularity.FAV_FACTOR],
            },
            {
              $multiply: ['$downloadsNr', config.popularity.DOWNLOAD_FACTOR],
            },
            {
              $multiply: [
                { $size: { $ifNull: ['$comments', []] } },
                config.popularity.COMMENT_FACTOR,
              ],
            },
          ],
        },
      },
    },
    { $sort: { popularity: -1, createdAt: -1 } },
  ])
    .skip(getSkip(page))
    .limit(config.pages.PAGE_SIZE)
    .exec();
};

export const listNewest = (
  user: Pick<UserDB, 'email' | 'isAdmin'>,
  page: number,
) => {
  return Resource.find(matchCriteria(user))
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(config.pages.PAGE_SIZE)
    .exec();
};

export const countAll = (user: Pick<UserDB, 'email' | 'isAdmin'>) => {
  return Resource.find(matchCriteria(user)).countDocuments().exec();
};

export const listByIds = (
  user: Pick<UserDB, 'email' | 'isAdmin'>,
  ids: string[],
  page: number,
) => {
  return Resource.find({ _id: { $in: ids }, ...matchCriteria(user) })
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(config.pages.PAGE_SIZE)
    .exec();
};

export const countByIds = (
  user: Pick<UserDB, 'email' | 'isAdmin'>,
  ids: string[],
) => {
  return Resource.find({ _id: { $in: ids }, ...matchCriteria(user) })
    .countDocuments()
    .exec();
};

export const listbyUser = (
  user: Pick<UserDB, 'email' | 'isAdmin'>,
  email: string,
  page: number,
) => {
  return Resource.find({ userEmail: email, ...matchCriteria(user) })
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(config.pages.PAGE_SIZE)
    .exec();
};

export const countByUser = (
  user: Pick<UserDB, 'email' | 'isAdmin'>,
  email: string,
) => {
  return Resource.find({ userEmail: email, ...matchCriteria(user) })
    .countDocuments()
    .exec();
};

const searchPipeline = (query: string) => [
  {
    $lookup: {
      from: 'subjects',
      localField: 'subjectId',
      foreignField: '_id',
      as: 'subject',
    },
  },
  { $unwind: '$subject' },

  {
    $lookup: {
      from: 'courses',
      localField: 'courseId',
      foreignField: '_id',
      as: 'course',
    },
  },
  { $unwind: '$course' },

  {
    $lookup: {
      from: 'documentTypes',
      localField: 'documentTypeId',
      foreignField: '_id',
      as: 'documentType',
    },
  },
  { $unwind: '$documentType' },

  {
    $match: {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { '$documentType.name': { $regex: query, $options: 'i' } },
        { documentFormat: { $regex: query, $options: 'i' } },
        { userEmail: { $regex: query, $options: 'i' } },
        { userName: { $regex: query, $options: 'i' } },
        { hashtags: { $regex: query, $options: 'i' } },
        { '$subject.name': { $regex: query, $options: 'i' } },
        { '$course.name': { $regex: query, $options: 'i' } },
      ],
    },
  },

  {
    $project: {
      _id: 1,
      title: 1,
      description: 1,
      documentType: {
        _id: '$documentType._id',
        name: '$documentType.name',
      },
      documentFormat: 1,
      userEmail: 1,
      userName: 1,
      hashtags: 1,
      subject: {
        _id: '$subject._id',
        courseId: '$subject.courseId',
        name: '$subject.name',
      },
      course: {
        _id: '$course._id',
        name: '$course.name',
      },
      createdAt: 1,
      favoritesNr: 1,
      upvotesNr: 1,
      downvotesNr: 1,
      downloadsNr: 1,
      edited: 1,
    },
  },
];

export const search = (query: string, page: number) => {
  return Resource.aggregate(searchPipeline(query))
    .skip(getSkip(page))
    .limit(config.pages.PAGE_SIZE)
    .exec();
};

export const countSearch = (query: string) => {
  return Resource.aggregate(searchPipeline(query)).then((res) => res.length);
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

export const setIsVisible = (id: string, value: boolean) => {
  return Resource.findByIdAndUpdate(id, { $set: { isVisible: value } });
};

export const setIsLocked = (id: string, value: boolean) => {
  return Resource.findByIdAndUpdate(id, { $set: { isLocked: value } });
};

export const addDownload = (id: string) => {
  return Resource.updateOne({ _id: id }, { $inc: { downloadsNr: 1 } }).exec();
};
