'use server';

import * as SubjectController from '@/controllers/Subject';
import * as CourseController from '@/controllers/Course';
import * as UserController from '@/controllers/User';
import * as DocumentTypeController from '@/controllers/DocumentType';
import * as CommentController from '@/controllers/Comment';
import {
  CommentDB,
  CourseDB,
  DocumentTypeDB,
  ResourceDB,
  ResourceDTO,
  SubjectDB,
  UserDB,
} from '@/lib/types';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const dbsToDtos = async (resources: ResourceDB[]) => {
  const session = await getServerSession(authOptions);

  // get unique subject, course ids, document type ids and user emails
  const subject_ids = Array.from(
    new Set(resources.map((resource) => resource.subjectId)),
  );
  const course_ids = Array.from(
    new Set(resources.map((resource) => resource.courseId)),
  );
  const user_emails = Array.from(
    new Set(resources.map((resource) => resource.userEmail)),
  );
  const document_type_ids = Array.from(
    new Set(resources.map((resource) => resource.documentTypeId)),
  );

  // get subjects, courses, document types, users and comments
  const subjects =
    ((await SubjectController.listByIds(subject_ids)) as SubjectDB[]) ?? [];
  const courses =
    ((await CourseController.listByIds(course_ids)) as CourseDB[]) ?? [];
  const document_types =
    ((await DocumentTypeController.listByIds(
      document_type_ids,
    )) as DocumentTypeDB[]) ?? [];
  const users =
    ((await UserController.listByEmails(user_emails)) as UserDB[]) ?? [];
  const comments = ((await CommentController.list()) as CommentDB[]) ?? [];

  // get user interactions
  let interactions = {
    favoritedResourceIds: [] as string[],
    upvotedResourceIds: [] as string[],
    downvotedResourceIds: [] as string[],
  };
  if (session?.user?.email) {
    interactions = (await UserController.getInteractions(
      session.user.email,
    )) as {
      favoritedResourceIds: string[];
      upvotedResourceIds: string[];
      downvotedResourceIds: string[];
    };
  }

  return resources.map((resource) => {
    const subject_name =
      subjects.find(
        (subject) =>
          new ObjectId(subject._id).toString() ===
          new ObjectId(resource.subjectId).toString(),
      )?.name ?? '';
    const course_name =
      courses.find(
        (course) =>
          new ObjectId(course._id).toString() ===
          new ObjectId(resource.courseId).toString(),
      )?.name ?? '';
    const user_name =
      users.find((user) => user.email === resource.userEmail)?.name ?? '';
    const document_type_name =
      document_types.find(
        (document_type) =>
          new ObjectId(document_type._id).toString() ===
          new ObjectId(resource.documentTypeId).toString(),
      )?.name ?? '';
    const commentsNr =
      comments.filter(
        (c) =>
          new ObjectId(c.resourceId).toString() ===
          new ObjectId(resource._id).toString(),
      ).length ?? 0;
    const isFavorite = interactions.favoritedResourceIds.includes(resource._id);
    const isUpvoted = interactions.upvotedResourceIds.includes(resource._id);
    const isDownvoted = interactions.downvotedResourceIds.includes(
      resource._id,
    );

    return {
      _id: resource._id.toString(),
      title: resource.title,
      description: resource.description,
      documentType: {
        _id: resource.documentTypeId,
        name: document_type_name,
      },
      documentFormat: resource.documentFormat,
      userEmail: resource.userEmail,
      userName: user_name,
      hashtags: resource.hashtags.split(' '),
      subject: {
        _id: resource.subjectId,
        courseId: resource.courseId,
        name: subject_name,
      },
      course: {
        _id: resource.courseId,
        name: course_name,
      },
      createdAt: resource.createdAt,
      favoritesNr: resource.favoritesNr,
      upvotesNr: resource.upvotesNr,
      downloadsNr: resource.downloadsNr,
      commentsNr: commentsNr,
      isFavorite: isFavorite,
      isUpvoted: isUpvoted,
      isDownvoted: isDownvoted,
      isVisible:resource.isVisible,
      isLocked:resource.isLocked,
      edited: resource.edited ?? null,
    };
  }) as ResourceDTO[];
};

export const dbToDto = async (resource: ResourceDB) => {
  const session = await getServerSession(authOptions);

  const subject =
    ((await SubjectController.get(resource.subjectId)) as SubjectDB) ?? {};
  const subject_name = subject.name ?? '';
  const course =
    ((await CourseController.get(resource.courseId)) as CourseDB) ?? {};
  const course_name = course.name ?? '';
  const user = ((await UserController.get(resource.userEmail)) as UserDB) ?? {};
  const user_name = user.name ?? '';
  const document_type =
    ((await DocumentTypeController.get(
      resource.documentTypeId,
    )) as DocumentTypeDB) ?? {};
  const document_type_name = document_type.name ?? '';
  const comments =
    ((await CommentController.getResourceComments(
      resource._id,
    )) as CommentDB[]) ?? [];
  const commentsNr = comments.length ?? 0;

  // get user interactions
  let interactions = {
    favoritedResourceIds: [] as string[],
    upvotedResourceIds: [] as string[],
    downvotedResourceIds: [] as string[],
  };
  if (session?.user?.email) {
    interactions = (await UserController.getInteractions(
      session.user.email,
    )) as {
      favoritedResourceIds: string[];
      upvotedResourceIds: string[];
      downvotedResourceIds: string[];
    };
  }

  const isFavorite = interactions.favoritedResourceIds.includes(resource._id);
  const isUpvoted = interactions.upvotedResourceIds.includes(resource._id);
  const isDownvoted = interactions.downvotedResourceIds.includes(resource._id);

  return {
    _id: resource._id.toString(),
    title: resource.title,
    description: resource.description,
    documentType: {
      _id: resource.documentTypeId,
      name: document_type_name,
    },
    documentFormat: resource.documentFormat,
    userEmail: resource.userEmail,
    userName: user_name,
    hashtags: resource.hashtags.split(' '),
    subject: {
      _id: resource.subjectId,
      courseId: resource.courseId,
      name: subject_name,
    },
    course: {
      _id: resource.courseId,
      name: course_name,
    },
    createdAt: resource.createdAt,
    favoritesNr: resource.favoritesNr,
    upvotesNr: resource.upvotesNr,
    downloadsNr: resource.downloadsNr,
    commentsNr: commentsNr,
    isFavorite: isFavorite,
    isUpvoted: isUpvoted,
    isDownvoted: isDownvoted,
    isVisible:resource.isVisible,
    isLocked:resource.isLocked,
    edited: resource.edited ?? null,
  } as ResourceDTO;
};
