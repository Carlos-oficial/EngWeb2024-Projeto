import mongoose, { Schema, model } from 'mongoose';

interface ICourse {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const CourseSchema = new Schema<ICourse>({
  _id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

const Course = model<ICourse>('Course', CourseSchema);

export default Course;
