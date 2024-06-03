export type ResourceDTO = {
  _id: string;
  title: string;
  description: string;
  documentType: string;
  documentFormat: string;
  userEmail: string;
  userName: string;
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
  file: string;
  userEmail: string;
};

export type ResourceForm = {
  title: string;
  description: string;
  documentTypeId: string;
  documentFormat: string;
  hashtags: string;
  subjectId: string;
  courseId: string;
  createdAt: Date;
  file: FileList;
  userEmail: string;
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
  image: string;
  emailVerified: Date | null; // idk
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

export interface CustomUser {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: Date | null;
}

export type CustomSession = {
  user: CustomUser;
  expires: string;
};

declare module 'next-auth' {
  interface Session {
    user: CustomUser;
    expires: string;
  }
}
