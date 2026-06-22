import { Router } from "express";
import { ProductController } from "../../services/productController";
import { RoutesApp } from "../../../core/routes";
import { validateJWT } from "../../../middlewares/validate-jwt";
import { checkRole } from "../../../middlewares/validate-role";
import { upload } from "../../../middlewares/cloudinary";

export class ProductRoutes extends RoutesApp {
  public router: Router;
  private productController: ProductController;

  constructor() {
    super();
    this.router = Router();
    this.productController = new ProductController();
    this.setServicesRoutes();
  }

  protected setServicesRoutes(): void {
    this.router.post(
      "/create",
      validateJWT,
      checkRole(["admin"]),
      upload.single("image"),
      this.productController.create.bind(this.productController),
    );

    this.router.get(
      "/",
      this.productController.read.bind(this.productController),
    );

    this.router.get(
      "/:id",
      this.productController.readById.bind(this.productController),
    );

    this.router.put(
      "/:id",
      validateJWT,
      checkRole(["admin"]),
      upload.single("image"),
      this.productController.update.bind(this.productController),
    );

    this.router.delete(
      "/:id",
      validateJWT,
      checkRole(["admin"]),
      this.productController.delete.bind(this.productController),
    );
  }
}
