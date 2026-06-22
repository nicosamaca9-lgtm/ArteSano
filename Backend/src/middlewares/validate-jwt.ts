import { Request, Response, NextFunction } from 'express';
// Importamos tu función checkToken
import { checkToken } from '../app/helpers/jwt'; 

// Extendemos la interfaz Request de Express para poder inyectarle el 'uid'
export interface CustomRequest extends Request {
    uid?: string;
}

export const validateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1. Extraer el token de la cookie.
    const token = req.cookies?.token;

    // 2. Si el cliente no envió ningún token, lo rebotamos
    if (!token) {
        return res.status(401).json({
            ok: false,
            error_message: 'No hay token en la petición'
        });
    }

    // 3. Pasamos el token por tu función validadora
    const [isValid, result] = checkToken(token);

    // 4. Si la validación falla (token falso, modificado o expirado)
    if (!isValid) {
        return res.status(401).json({
            ok: false,
            error_message: 'Token no válido o expirado'
        });
    }

    // 5. Si todo está bien, guardamos el ID del usuario en la petición (la "pulsera")
    // Como sabemos que si es válido result es un string (el id), hacemos el casting
    req.uid = result as string;

    // 6. Autorizamos el paso hacia el controlador
     return next();
};