import { Router } from "express";
import { OrderController } from "../../services/orderController";
import { RoutesApp } from "../../../core/routes";
import { validateJWT } from "../../../middlewares/validate-jwt";

export class OrderRoutes extends RoutesApp {
  public router: Router;
  private orderController: OrderController;

  constructor() {
    super();
    this.router = Router();
    this.orderController = new OrderController();
    this.setServicesRoutes();
  }

  protected setServicesRoutes(): void {
    this.router.post(
      "/create-preference",
      validateJWT,
      this.orderController.createPreference.bind(this.orderController),
    );

    this.router.get(
      "/my-orders",
      validateJWT,
      this.orderController.getMyOrders.bind(this.orderController),
    );

    this.router.get(
      "/:id",
      validateJWT,
      this.orderController.getOrderById.bind(this.orderController),
    );
  }
}
