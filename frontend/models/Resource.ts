import { model, models, Schema, Types } from 'mongoose';

interface IResource {
  title: string;
  description: string;
  documentType: string;
  documentFormat: string;
  hashtags: string;
  subjectId: string;
  courseId: string;
  createdAt: Date;
  file: string;
  userId: Types.ObjectId;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String },
  description: { type: String },
  documentType: { type: String },
  documentFormat: { type: String },
  hashtags: { type: String },
  subjectId: { type: String },
  courseId: { type: String },
  createdAt: { type: Date },
  file: { type: String },
  userId: { type: Schema.Types.ObjectId },
});

const Resource =
  models.Resource || model<IResource>('Resource', ResourceSchema);

export default Resource;
