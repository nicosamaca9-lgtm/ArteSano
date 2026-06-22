import { Request, Response, NextFunction } from "express";
import { UserModel } from "../app/models/user"; // Ajusta la ruta a tu modelo

export const checkRole = (rolesAllowed: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = (req as any).uid;

      // Buscamos al usuario en la BD
      const user = await UserModel.findOne({ id: uid });

      if (!user) {
        res
          .status(401)
          .json({ ok: false, error_message: "Usuario no encontrado" });
        return;
      }

      // Validamos si su rol está dentro de los permitidos para esta ruta
      if (!rolesAllowed.includes(user.role)) {
        res
          .status(403)
          .json({
            ok: false,
            error_message: "Acceso denegado: No tienes los permisos necesarios",
          });
        return;
      }

      // 💡 MAGIA: Inyectamos el usuario completo en la petición
      // Así los controladores sabrán qué rol y país tiene quien hace la petición
      (req as any).user = user;

      return next();
    } catch (error) {
      res
        .status(500)
        .json({ ok: false, error_message: "Error validando roles" });
      return;
    }
  };
};
