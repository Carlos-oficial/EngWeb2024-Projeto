import { model, models, Schema } from 'mongoose';

interface ICourse {
  name: string;
}

const CourseSchema = new Schema<ICourse>({
  name: { type: String, unique: true, required: true },
});

const Course = models.Course || model<ICourse>('Course', CourseSchema);

export default Course;
