import { Schema, model, Document } from "mongoose";
import { IUser } from "../interfaces/user";

interface IUserDocument extends IUser, Document {}

export const UserSchema = new Schema<IUserDocument>({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  email: {
    type: String,
    unique: true,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  phone: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  password: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
  },
  role: {
    type: String,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
    enum: ["admin", "client"],
    default: "client",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  CreatedAt: {
    type: Date,
    required: function (this: IUserDocument) {
      return this.isNew;
    },
    default: Date.now,
  },
  UpdatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
} as any);

UserSchema.method("toJSON", function () {
  const { __v, _id, password, ...data } = this.toObject();
  data.uid = _id;
  return data;
});

UserSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.UpdatedAt = new Date();
  }
  next();
});

export const UserModel = model("User", UserSchema);
