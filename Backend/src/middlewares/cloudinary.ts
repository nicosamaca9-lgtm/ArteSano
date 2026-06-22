import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

import { CONFIG } from "../config";

// 1. Configurar tus credenciales
cloudinary.config({
  cloud_name: CONFIG.cloudinary.cloudName,
  api_key: CONFIG.cloudinary.apiKey,
  api_secret: CONFIG.cloudinary.apiSecret,
});

// 2. Configurar el motor de almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "artesano_products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // Solo limitamos el tamaño máximo para ahorrar espacio
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  } as any,
});
// 3. Exportar el middleware
export const upload = multer({ storage });
export { cloudinary };
