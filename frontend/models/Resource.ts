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
  title: { type: String, required: true },
  description: { type: String, required: true },
  documentTypeId: { type: String, ref: 'DocumentType', required: true },
  documentFormat: { type: String, required: true },
  hashtags: { type: String },
  subjectId: { type: String, ref: 'Subject', required: true },
  courseId: { type: String, ref: 'Course', required: true },
  createdAt: { type: Date, required: true },
  userEmail: { type: String, ref: 'User', required: true },
});

const Resource =
  models.Resource || model<IResource>('Resource', ResourceSchema);

export default Resource;
