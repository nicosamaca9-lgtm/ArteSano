import { Request, Response } from "express";
import { CustomResponse, Comment, CommentService } from "../interfaces/comment";
import { CommentModel } from "../models/comment";
import crypto from "crypto";

export type CommentResponse = CustomResponse<Comment | Comment[]>;

export class CommentController implements CommentService<CommentResponse> {
  public async create(req: Request, res: Response): Promise<CommentResponse> {
    try {
      const { name, content, rating } = req.body;

      const newComment = await CommentModel.create({
        id: crypto.randomUUID(),
        name,
        content,
        rating,
      });

      return res.status(201).json({
        ok: true,
        message: "Comentario creado correctamente",
        comment: newComment,
      });
    } catch (error) {
      console.error("error al crear el comentario", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al crear el comentario",
      } as any);
    }
  }

  public async read(req: Request, res: Response): Promise<CommentResponse> {
    try {
      const comments = await CommentModel.find();
      return res.status(200).json({
        ok: true,
        comments,
      });
    } catch (error) {
      console.error("error al obtener los comentarios", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener los comentarios",
      } as any);
    }
  }

  public async delete(req: Request, res: Response): Promise<CommentResponse> {
    try {
      const { id } = req.params;

      const deletedComment = await CommentModel.findOneAndDelete({ id });

      if (!deletedComment) {
        return res.status(404).json({
          ok: false,
          error_message: "Comentario no encontrado",
        } as any);
      }

      return res.status(200).json({
        ok: true,
        message: "Comentario eliminado correctamente",
      } as any);
    } catch (error) {
      console.error("error al eliminar el comentario", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al eliminar el comentario",
      } as any);
    }
  }
}
