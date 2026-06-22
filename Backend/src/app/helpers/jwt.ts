// Importa el paquete jsonwebtoken y su tipo JwtPayload para trabajar con JWT
import jwt, { JwtPayload } from "jsonwebtoken";
// Importa la configuración global, donde está la clave secreta JWT
import { CONFIG } from "../../config";

// Define una interfaz para extender el JwtPayload y asegurar que el payload personalizado contiene una propiedad id de tipo string
interface CustomJwtPayload extends JwtPayload {
  id: string
}

// Función asíncrona para generar un token JWT tomando como argumento el id del usuario
export async function generateToken(id: string): Promise<any> {
  try {
    // Crea un objeto payload que contiene únicamente el id
    const payload = { id };
    // Firma el payload para crear el token, usando la llave secreta y configurando su expiración a 48 horas
    const token = jwt.sign(payload, CONFIG.jwt_key, { expiresIn: "48h" });
    // Retorna el token generado
    return token;
  } catch (error) {
    // En caso de error al generar el token, muestra el error por consola
    console.error("no se pudo gererar el jwt", error);
  }
}

// Función que verifica y decodifica un JWT, retornando un booleano e id de usuario, o un error si la verificación falla
export function checkToken(token: string): [boolean, string | Error] {
  try {
    // Decodifica (y valida) el token usando la clave secreta, asegurando el tipo del payload
    const decoded = jwt.verify(token, CONFIG.jwt_key) as CustomJwtPayload;
    // Si la decodificación fue exitosa y contiene un 'id', retorna true y el 'id'
    if (decoded && decoded.id) {
      return [true, decoded.id];
    }
    // Si el token es válido pero no contiene un 'id', retorna false y un error personalizado
    return [false, new Error("Token does not contain id")];
  } catch (error) {
    // Si ocurre un error (token inválido, expirado, etc.), retorna false y el error capturado
    return [false, error as Error];
  }
}
