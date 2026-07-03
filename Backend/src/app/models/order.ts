import { Schema, model, Document } from "mongoose";
import { IOrder } from "../interfaces/order";

interface IOrderDocument extends Omit<IOrder, "id">, Document {
  id?: string;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

export const OrderSchema = new Schema<IOrderDocument>({
  id: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  items: [OrderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentId: {
    type: String,
    sparse: true,
    unique: true,
  },
  externalReference: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    required: function (this: IOrderDocument) {
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

OrderSchema.method("toJSON", function () {
  const { __v, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
});

OrderSchema.pre("save", function (next) {
  if (!this.isNew) {
    this.UpdatedAt = new Date();
  }
  next();
});

export const OrderModel = model("Order", OrderSchema);
