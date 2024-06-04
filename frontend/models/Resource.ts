import { model, models, Schema } from 'mongoose';

interface IResource {
  title: string;
  description: string;
  documentTypeId: string;
  documentFormat: string;
  hashtags: string;
  subjectId: string;
  courseId: string;
  createdAt: Date;
  userEmail: string;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String },
  description: { type: String },
  documentTypeId: { type: String, ref: 'DocumentType' },
  documentFormat: { type: String },
  hashtags: { type: String },
  subjectId: { type: String, ref: 'Subject' },
  courseId: { type: String, ref: 'Course' },
  createdAt: { type: Date },
  userEmail: { type: String, ref: 'User' },
});

const Resource =
  models.Resource || model<IResource>('Resource', ResourceSchema);

export default Resource;
