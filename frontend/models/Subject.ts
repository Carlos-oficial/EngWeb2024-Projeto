import mongoose, { Schema, model } from 'mongoose';

interface ISubject {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  name: string;
}

const SubjectSchema = new Schema<ISubject>({
  _id: { type: Schema.Types.ObjectId, required: true },
  courseId: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

const Subject = model<ISubject>('Subject', SubjectSchema);

export default Subject;
