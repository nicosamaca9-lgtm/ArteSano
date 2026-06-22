import { Router } from "express";
import { UserController } from "../../services/userController";
import { RoutesApp } from "../../../core/routes";
import { validateJWT } from "../../../middlewares/validate-jwt";

export class AuthRoutes extends RoutesApp {
  public router: Router;
  private userController: UserController;

  constructor() {
    super();
    this.router = Router();
    this.userController = new UserController();
    this.setServicesRoutes();
  }

  protected setServicesRoutes(): void {
    this.router.post(
      "/create",
      this.userController.create.bind(this.userController),
    );
    this.router.post("/", this.userController.login.bind(this.userController));
    this.router.post("/logout", this.userController.logout.bind(this.userController));

    this.router.get(
      "/",
      validateJWT,
      this.userController.getUserCredentials.bind(this.userController),
    );

    this.router.put(
      "/:id",
      validateJWT,
      this.userController.update.bind(this.userController),
    );

    this.router.delete(
      "/:id",
      validateJWT,
      this.userController.delete.bind(this.userController),
    );
  }
}
