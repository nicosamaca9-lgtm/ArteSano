import { Router } from "express";
import { CommentController } from "../../services/commentController";
import { RoutesApp } from "../../../core/routes";
import { validateJWT } from "../../../middlewares/validate-jwt";
import { checkRole } from "../../../middlewares/validate-role";

export class CommentRoutes extends RoutesApp {
  public router: Router;
  private commentController: CommentController;

  constructor() {
    super();
    this.router = Router();
    this.commentController = new CommentController();
    this.setServicesRoutes();
  }

  protected setServicesRoutes(): void {
    this.router.post(
      "/create",
      this.commentController.create.bind(this.commentController)
    );

    this.router.get(
      "/",
      this.commentController.read.bind(this.commentController)
    );

    this.router.delete(
      "/:id",
      validateJWT,
      checkRole(["admin"]),
      this.commentController.delete.bind(this.commentController)
    );
  }
}
