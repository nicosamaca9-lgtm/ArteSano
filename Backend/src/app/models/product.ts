import { Schema, model, Document } from "mongoose";
import { IProduct } from "../interfaces/product";

interface IProductDocument extends IProduct, Document {}

export const ProductSchema = new Schema<IProductDocument>({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: function (this: IProductDocument) {
      return this.isNew;
    },
  },
  description: {
    type: String,
    required: function (this: IProductDocument) {
      return this.isNew;
    },
  },
  price: {
    type: Number,
    required: function (this: IProductDocument) {
      return this.isNew;
    },
    validate: {
      validator: function (v: number) {
        return v > 0;
      },
      message: "El precio debe ser mayor a 0",
    },
  },
  image: {
    type: String,
    required: function (this: IProductDocument) {
      return this.isNew;
    },
  },
  category: {
    type: String,
    required: function (this: IProductDocument) {
      return this.isNew;
    },
    enum: ["antojos", "jugos y smoothies", "comida"],
  },
  isCarousel: {
    type: Boolean,
    default: false,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  CreatedAt: {
    type: Date,
    required: function (this: IProductDocument) {
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

ProductSchema.method("toJSON", function () {
  const { __v, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
});

ProductSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.UpdatedAt = new Date();
  }
  next();
});

export const ProductModel = model("Product", ProductSchema);
