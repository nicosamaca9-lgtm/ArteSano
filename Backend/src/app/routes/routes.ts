import { Express } from "express";
import { AuthRoutes } from "./user/user";
import { ProductRoutes } from "./product/product";
import { CommentRoutes } from "./comment/comment";
import { OrderRoutes } from "./order/order";
import { WebhookRoutes } from "./webhook/webhook";

export class RoutesApi {
  private _app: Express; //Api principal
  private authRouter: AuthRoutes;
  private productRouter: ProductRoutes;
  private commentRouter: CommentRoutes;
  private orderRouter: OrderRoutes;
  private webhookRouter: WebhookRoutes;

  constructor(app: Express) {
    this._app = app;
    this.authRouter = new AuthRoutes();
    this.productRouter = new ProductRoutes();
    this.commentRouter = new CommentRoutes();
    this.orderRouter = new OrderRoutes();
    this.webhookRouter = new WebhookRoutes();
    this.initRoutes();
  }

  private initRoutes(): void {
    this._app.use("/api/v1/user", this.authRouter.router);
    this._app.use("/api/v1/product", this.productRouter.router);
    this._app.use("/api/v1/comment", this.commentRouter.router);
    this._app.use("/api/v1/order", this.orderRouter.router);
    this._app.use("/api/v1/webhook", this.webhookRouter.router);
  }
}


//localhost:3000/api/v1/user/create
