import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id?: string; // UUID of the order
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentId?: string;
  externalReference: string;
  address: string; // Added address field
}

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";
export type IOrder = RowRecord<Order>;
export type CustomResponse<TResponse> = void | TResponse | Response;

export interface OrderService<TResponse> {
  createPreference(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
}
