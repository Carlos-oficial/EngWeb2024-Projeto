import { ResourceDB } from '@/lib/types';
import FavoritesPerResource from '@/models/FavoritesPerResource';
import Resource from '@/models/Resource';
import { PAGE_SIZE, getSkip } from '@/lib/utils';

export const listAll = (page: number) => {
  return Resource.find()
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(PAGE_SIZE)
    .exec();
};

const FAV_FACTOR = 0.6;
const COMMENT_FACTOR = 0.1;

export const listPopular = (page: number) => {
  return Resource.aggregate([
    {
      $lookup: {
        from: 'favoritesperresources',
        localField: '_id',
        foreignField: 'resourceId',
        as: 'favorites',
      },
    },
    {
      $unwind: { path: '$favorites', preserveNullAndEmptyArrays: true },
    },

    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'resourceId',
        as: 'comments',
      },
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
        popularity: {
          $add: [
            {
              $multiply: [
                { $size: { $ifNull: ['$favorites.userEmails', []] } },
                FAV_FACTOR,
              ],
            },
            {
              $multiply: [
                { $size: { $ifNull: ['$comments', []] } },
                COMMENT_FACTOR,
              ],
            },
          ],
        },
      },
    },
    { $sort: { popularity: -1, createdAt: -1 } },
  ])
    .skip(getSkip(page))
    .limit(PAGE_SIZE)
    .exec();
};

export const listNewest = (page: number) => {
  return Resource.find()
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(PAGE_SIZE)
    .exec();
};

export const countAll = () => {
  return Resource.find().countDocuments().exec();
};

export const listByIds = (ids: string[], page: number) => {
  return Resource.find({ _id: { $in: ids } })
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(PAGE_SIZE)
    .exec();
};

export const countByIds = (ids: string[]) => {
  return Resource.find({ _id: { $in: ids } })
    .countDocuments()
    .exec();
};

export const listbyUser = (email: string, page: number) => {
  return Resource.find({ userEmail: email })
    .sort({ createdAt: -1 })
    .skip(getSkip(page))
    .limit(PAGE_SIZE)
    .exec();
};

export const countByUser = (email: string) => {
  return Resource.find({ userEmail: email }).countDocuments().exec();
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
    },
  },
];

export const search = (query: string, page: number) => {
  return Resource.aggregate(searchPipeline(query))
    .skip(getSkip(page))
    .limit(PAGE_SIZE)
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

export const getFavorites = (id: string) => {
  return FavoritesPerResource.findOne({ resourceId: id }).exec();
};

export const listFavorites = () => {
  return FavoritesPerResource.find().exec();
};
