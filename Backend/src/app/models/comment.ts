import { Schema, model, Document } from "mongoose";
import { IComment } from "../interfaces/comment";

interface ICommentDocument extends IComment, Document {}

export const CommentSchema = new Schema<ICommentDocument>({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: function (this: ICommentDocument) {
      return this.isNew;
    },
  },
  content: {
    type: String,
    required: function (this: ICommentDocument) {
      return this.isNew;
    },
  },
  rating: {
    type: Number,
    required: function (this: ICommentDocument) {
      return this.isNew;
    },
    validate: {
      validator: function(v: number) {
        return v >= 1 && v <= 5;
      },
      message: 'La calificación debe estar entre 1 y 5'
    }
  },
  CreatedAt: {
    type: Date,
    required: function (this: ICommentDocument) {
      return this.isNew;
    },
    default: Date.now,
  },
  UpdatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

CommentSchema.method('toJSON', function () {
  const { __v, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
});

CommentSchema.pre('save', function (next) {
  if (!this.isNew) {
    this.UpdatedAt = new Date();
  }
  next();
});

export const CommentModel = model('Comment', CommentSchema);
