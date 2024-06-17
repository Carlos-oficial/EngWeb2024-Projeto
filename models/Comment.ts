import { model, models, Schema, Types } from 'mongoose';

interface IComment {
  resourceId: Types.ObjectId;
  userEmail: string;
  message: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  resourceId: { type: Schema.Types.ObjectId, required: true, ref: 'Resource' },
  userEmail: { type: String, required: true, ref: 'User' },
  message: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

const Comment = models.Comment || model<IComment>('Comment', CommentSchema);

export default Comment;
