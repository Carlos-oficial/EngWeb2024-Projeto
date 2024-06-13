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
  favoritesNr: number;
  upvotesNr: number;
  downvotesNr: number;
  downloadsNr: number;
  edited: Date;
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
  favoritesNr: { type: Number, default: 0 },
  upvotesNr: { type: Number, default: 0 },
  downvotesNr: { type: Number, default: 0 },
  downloadsNr: { type: Number, default: 0 },
  edited: { type: Date },
});

const Resource =
  models.Resource || model<IResource>('Resource', ResourceSchema);

export default Resource;
