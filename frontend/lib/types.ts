export type ResourceDTO = {
  _id: string;
  title: string;
  description: string;
  documentType: string;
  documentFormat: string;
  username: string;
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
  documentType: string;
  documentFormat: string;
  hashtags: string;
  subjectId: string;
  courseId: string;
  createdAt: Date;
  file: string;
  username: string;
};

export type ResourceForm = {
  title: string;
  description: string;
  documentType: string;
  documentFormat: string;
  hashtags: string;
  subjectId: string;
  courseId: string;
  createdAt: Date;
  file: FileList;
  username: string;
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
