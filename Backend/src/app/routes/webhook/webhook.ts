import { Router } from "express";
import { handleMercadoPagoWebhook } from "../../services/webhookController";
import { RoutesApp } from "../../../core/routes";

export class WebhookRoutes extends RoutesApp {
  public router: Router;

  constructor() {
    super();
    this.router = Router();
    this.setServicesRoutes();
  }

  protected setServicesRoutes(): void {
    // IMPORTANTE: Mercado Pago envía las notificaciones a esta ruta sin token JWT,
    // por lo que no debemos usar el middleware validateJWT aquí.
    this.router.post(
      "/mercadopago",
      handleMercadoPagoWebhook
    );
  }
}
