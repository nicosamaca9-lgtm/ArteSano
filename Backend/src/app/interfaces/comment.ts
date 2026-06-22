import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface Comment {
  name: string;
  content: string;
  rating: number; // 1-5
}

export type IComment = RowRecord<Comment>;
export type CustomResponse<TResponse> = void | TResponse | Response;

export interface CommentService<TResponse> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  read(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  delete(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
}
