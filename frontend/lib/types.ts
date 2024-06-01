export type ResourceDTO = {
  _id: string;
  title: string;
  description: string;
  documentType: string;
  documentFormat: string;
  username: string;
  hashtags: string[];
  subject: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  createdAt: Date;
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
};
