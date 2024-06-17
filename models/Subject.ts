import { model, models, Schema, Types } from 'mongoose';

interface ISubject {
  courseId: Types.ObjectId;
  name: string;
}

const SubjectSchema = new Schema<ISubject>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
});

const Subject = models.Subject || model<ISubject>('Subject', SubjectSchema);

export default Subject;
