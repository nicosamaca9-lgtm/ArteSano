import { Resend } from "resend";
import { Request, Response } from "express";
import { OrderModel } from "../models/order";
import { UserModel } from "../models/user";
import { CONFIG } from "../../config";

// We use require since "mercadopago" is not always exported nicely with ES6
import { MercadoPagoConfig, Payment } from "mercadopago";

const resend = new Resend(CONFIG.resend.apiKey);
const client = new MercadoPagoConfig({ accessToken: CONFIG.mercadopago.accessToken });
const paymentClient = new Payment(client);

export const handleMercadoPagoWebhook = async (req: Request, res: Response) => {
  try {
    const { data, type } = req.body;

    // 1. Verificamos que sea un evento de pago
    if (type === "payment") {
      // Respondemos INMEDIATAMENTE a MercadoPago (Fast ACK) para evitar timeouts
      res.status(200).send("OK");
      
      const paymentId = data.id;

      // 2. Obtener información del pago desde la API oficial de MercadoPago
      // para evitar inyecciones falsas en el webhook
      const paymentInfo = await paymentClient.get({ id: paymentId });

      if (paymentInfo.status === "approved") {
        const externalReference = paymentInfo.external_reference;

        if (!externalReference) {
           console.log("Pago sin external_reference", paymentId);
           return;
        }

        // 3. Idempotencia y actualización atómica
        // Usamos findOneAndUpdate con un filtro extra para asegurar que si ya se procesó,
        // no envíe el correo de nuevo.
        const updatedOrder = await OrderModel.findOneAndUpdate(
          { 
            externalReference: externalReference,
            status: { $ne: "paid" } // Solo actualizamos si no está ya pagado
          }, 
          { 
            status: 'paid',
            paymentId: paymentId,
            UpdatedAt: new Date()
          },
          { new: true } // Devuelve el doc actualizado
        );

        if (!updatedOrder) {
          // Si no se actualizó, es porque no existe la orden o ya estaba pagada
          console.log(`Orden ${externalReference} ya estaba pagada o no existe.`);
          return;
        }

        console.log(`Pago ${paymentId} procesado, orden ${externalReference} actualizada a pagada.`);

        // 4. Enviamos el correo con Resend
        try {
          // Buscamos al usuario para obtener su correo real
          const user = await UserModel.findOne({ id: updatedOrder.userId });
          const userEmail = user?.email || "cliente@ejemplo.com";

          const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev", // En modo prueba de Resend, TIENE que ser este correo
            to: userEmail,
            subject: "¡Tu pago en ArteSano fue exitoso!",
            html: `
              <h2>¡Hola!</h2>
              <p>Tu pago ha sido procesado correctamente.</p>
              <p><strong>Total pagado:</strong> $${updatedOrder.totalAmount}</p>
              <p><strong>Dirección de envío:</strong> ${updatedOrder.address}</p>
              <p>¡Gracias por tu compra en ArteSano!</p>
            `,
          });

          if (error) {
            console.error("Resend API Error:", error);
          } else {
            console.log("Correo de confirmación enviado a:", userEmail);
          }
        } catch (emailError) {
          console.error("Excepción al enviar el correo con Resend:", emailError);
        }
      }
      return; // Ya respondimos al principio
    }

    // Si no es un evento de payment, simplemente retornamos OK
    return res.status(200).send("OK");
  } catch (error) {
    console.error("Error procesando el webhook:", error);
    // Si falla antes del ACK, retornamos 500 para que MP reintente
    if (!res.headersSent) {
      return res.status(500).send("Error interno");
    }
  }
};
