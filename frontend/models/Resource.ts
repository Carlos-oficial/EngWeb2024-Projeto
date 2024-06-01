import mongoose, { Schema, model } from 'mongoose';

interface IResource {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  documentType: string;
  documentFormat: string;
  hashtags: string;
  subjectId: string;
  courseId: string;
  createdAt: Date;
  file: string;
}

const ResourceSchema = new Schema<IResource>({
  _id: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  documentType: { type: String, required: true },
  documentFormat: { type: String, required: true },
  hashtags: { type: String, required: true },
  subjectId: { type: String, required: true },
  courseId: { type: String, required: true },
  createdAt: { type: Date, required: true },
  file: { type: String, required: true },
});

const Resource = model<IResource>('Resource', ResourceSchema);

export default Resource;
