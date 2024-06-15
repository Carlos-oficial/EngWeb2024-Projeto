export type ResourceDTO = {
  _id: string;
  title: string;
  description: string;
  documentType: {
    _id: string;
    name: string;
  };
  documentFormat: string;
  userEmail: string;
  userName: string;
  userImage: string;
  hashtags: string[];
  subject: {
    _id: string;
    courseId: string;
    name: string;
  };
  course: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  favoritesNr: number;
  upvotesNr: number;
  downloadsNr: number;
  commentsNr: number;
  isFavorite: boolean;
  isUpvoted: boolean;
  isDownvoted: boolean;
  edited: Date;
};

export type ResourceDB = {
  _id: string;
  title: string;
  description: string;
  documentTypeId: string;
  documentFormat: string;
  hashtags: string;
  subjectId: string;
  courseId: string;
  createdAt: Date;
  userEmail: string;
  favoritesNr: number;
  upvotesNr: number;
  downvotesNr: number;
  downloadsNr: number;
  edited: Date;
};

export type SubjectDB = {
  _id: string;
  courseId: string;
  name: string;
};

export type CourseDB = {
  _id: string;
  name: string;
};

export type DocumentTypeDB = {
  _id: string;
  name: string;
};

export type UserDB = {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  emailVerified: Date | null;
  isAdmin: boolean;
  favoritedResourceIds: string[];
  upvotedResourceIds: string[];
  downvotedResourceIds: string[];
};

export type UserSignUp = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserDTO = UserDB;

export type FavoritePerResourceDB = {
  _id: string;
  resourceId: string;
  userEmails: string[];
};

export type FavoritePerUserDB = {
  _id: string;
  userEmail: string;
  resourceIds: string[];
};

export type CommentDB = {
  _id: string;
  resourceId: string;
  userEmail: string;
  message: string;
  createdAt: Date;
};

export type CommentDTO = {
  _id: string;
  resourceId: string;
  userName: string;
  userEmail: string;
  userImage: string;
  message: string;
  createdAt: Date;
};

export type CommentWithResourceDTO = CommentDTO & {
  resource: ResourceDTO;
};

declare module 'next-auth' {
  interface Session {
    user: Pick<
      UserDB,
      '_id' | 'name' | 'email' | 'image' | 'emailVerified' | 'isAdmin'
    >;
    expires: string;
  }
}
