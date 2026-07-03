import { Request, Response } from "express";
import crypto from "crypto";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { OrderService, CustomResponse, OrderItem, Order } from "../interfaces/order";
import { OrderModel } from "../models/order";
import { ProductModel } from "../models/product";
import { CONFIG } from "../../config";

// Inicializar MercadoPago
const client = new MercadoPagoConfig({ accessToken: CONFIG.mercadopago.accessToken });
const preference = new Preference(client);

export type OrderResponse = CustomResponse<Order | Order[]>;

export class OrderController implements OrderService<OrderResponse> {
  public async createPreference(req: Request, res: Response): Promise<OrderResponse> {
    try {
      const { items, address } = req.body; // items: { productId, quantity }[]
      const uid = (req as any).uid;

      if (!items || items.length === 0) {
        return res.status(400).json({ ok: false, error_message: "No hay productos en la orden" } as any);
      }

      if (!address) {
        return res.status(400).json({ ok: false, error_message: "La dirección es obligatoria" } as any);
      }

      const orderItems: OrderItem[] = [];
      let totalAmount = 0;

      // 1. Validar productos y calcular total real desde DB (Cero Confianza al Frontend)
      for (const item of items) {
        const product = await ProductModel.findOne({ id: item.productId });
        
        if (!product) {
          return res.status(404).json({ ok: false, error_message: `Producto con ID ${item.productId} no encontrado` } as any);
        }

        const quantity = item.quantity;
        if (quantity <= 0) {
          return res.status(400).json({ ok: false, error_message: "La cantidad debe ser mayor a 0" } as any);
        }

        const unitPrice = product.price;
        
        orderItems.push({
          productId: product.id,
          name: product.name,
          quantity: quantity,
          unitPrice: unitPrice,
        });

        totalAmount += unitPrice * quantity;
      }

      const externalReference = crypto.randomUUID();

      // 2. Crear orden en BD como "pending"
      const newOrder = await OrderModel.create({
        id: crypto.randomUUID(),
        userId: uid,
        items: orderItems,
        totalAmount,
        status: "pending",
        externalReference,
        address
      });

      // 3. Crear preferencia en MercadoPago
      const preferenceData = {
        body: {
          items: orderItems.map(item => ({
            id: item.productId,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
          external_reference: externalReference,
          back_urls: {
            success: "http://localhost:5173/", // URL de éxito frontend
            failure: "http://localhost:5173/", 
            pending: "http://localhost:5173/"
          },
          notification_url: "https://prescribe-aptitude-sleet.ngrok-free.dev/api/v1/webhook/mercadopago" // Ngrok URL real
        }
      };

      const result = await preference.create(preferenceData);

      return res.status(200).json({
        ok: true,
        message: "Preferencia de pago creada",
        preferenceId: result.id,
        init_point: result.init_point,
      } as any);

    } catch (error) {
      console.error("Error al crear preferencia:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error interno al crear preferencia de MercadoPago",
      } as any);
    }
  }

  public async getMyOrders(req: Request, res: Response): Promise<OrderResponse> {
    try {
      const uid = (req as any).uid;
      const orders = await OrderModel.find({ userId: uid }).sort({ CreatedAt: -1 });

      return res.status(200).json({
        ok: true,
        orders,
      } as any);
    } catch (error) {
      return res.status(500).json({ ok: false, error_message: "Error al obtener órdenes" } as any);
    }
  }

  public async getOrderById(req: Request, res: Response): Promise<OrderResponse> {
      try {
          const { id } = req.params;
          const order = await OrderModel.findOne({ id });
          
          if (!order) {
            return res.status(404).json({ ok: false, error_message: "Orden no encontrada" } as any);
          }
          
          return res.status(200).json({ ok: true, order } as any);
      } catch (error) {
          return res.status(500).json({ ok: false, error_message: "Error al obtener la orden" } as any);
      }
  }
}
