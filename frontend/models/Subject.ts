import { model, models, Schema, Types } from 'mongoose';

interface ISubject {
  courseId: Types.ObjectId;
  name: string;
}

const SubjectSchema = new Schema<ISubject>({
  courseId: { type: Schema.Types.ObjectId },
  name: { type: String },
});

const Subject = models.Subject || model<ISubject>('Subject', SubjectSchema);

export default Subject;
