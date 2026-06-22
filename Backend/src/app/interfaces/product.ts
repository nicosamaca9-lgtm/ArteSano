import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface Product {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image?: string;
  isCarousel?: boolean;
  isSpecial?: boolean;
}

export type ProductCategory = "antojos" | "jugos/smoothies" | "comida";
export type IProduct = RowRecord<Product>;
export type CustomResponse<TResponse> = void | TResponse | Response;

export interface ProductService<TResponse> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  read(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  readById(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  update(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  delete(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
}
