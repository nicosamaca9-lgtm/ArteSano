import { Request, Response } from "express";
import { CustomResponse, Product, ProductService } from "../interfaces/product";
import { ProductModel } from "../models/product";
import crypto from "crypto";
import { cloudinary } from "../../middlewares/cloudinary";

export type ProductResponse = CustomResponse<Product | Product[]>;

const deleteImageFromCloudinary = async (imageUrl: string) => {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) return;
  
  try {
    const nameArray = imageUrl.split("/");
    const fileName = nameArray[nameArray.length - 1];
    const folderName = nameArray[nameArray.length - 2];
    const [publicId] = fileName.split(".");

    const fullPublicId = `${folderName}/${publicId}`;
    await cloudinary.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error("Error al eliminar la imagen de Cloudinary:", error);
  }
};

export class ProductController implements ProductService<ProductResponse> {
  public async create(req: Request, res: Response): Promise<ProductResponse> {
    try {
      // 1. Ya no extraemos 'image' del req.body, porque vendrá como archivo.
      const { name, description, price, category } = req.body;
      const isCarousel = req.body.isCarousel === 'true' || req.body.isCarousel === true;
      const isSpecial = req.body.isSpecial === 'true' || req.body.isSpecial === true;

      // 2. Capturamos la URL mágica de Cloudinary que nos dejó el middleware
      let imageUrl = "";
      if (req.file) {
        imageUrl = req.file.path;
      } else {
        // Opcional: Por si en algún momento quieres pasar una URL manualmente como texto
        imageUrl = req.body.image;
      }

      // 3. Creamos el producto usando esa variable imageUrl
      const newProduct = await ProductModel.create({
        id: crypto.randomUUID(),
        name,
        description,
        image: imageUrl, // Aquí asignamos la URL de Cloudinary
        price,
        category,
        isCarousel,
        isSpecial,
      });

      return res.status(201).json({
        ok: true,
        message: "Producto creado correctamente",
        product: newProduct,
      });
    } catch (error) {
      console.error("error al crear el producto", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al crear el producto",
      } as any);
    }
  }

  public async read(req: Request, res: Response): Promise<ProductResponse> {
    try {
      const products = await ProductModel.find();
      return res.status(200).json({
        ok: true,
        products,
      });
    } catch (error) {
      console.error("error al obtener los productos", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener los productos",
      } as any);
    }
  }

  public async readById(req: Request, res: Response): Promise<ProductResponse> {
    try {
      const { id } = req.params;
      const product = await ProductModel.findOne({ id });

      if (!product) {
        return res.status(404).json({
          ok: false,
          error_message: "Producto no encontrado",
        } as any);
      }

      return res.status(200).json({
        ok: true,
        product,
      });
    } catch (error) {
      console.error("error al obtener el producto", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener el producto",
      } as any);
    }
  }

  public async update(req: Request, res: Response): Promise<ProductResponse> {
    try {
      const { id } = req.params;

      const oldProduct = await ProductModel.findOne({ id });
      if (!oldProduct) {
        return res.status(404).json({
          ok: false,
          error_message: "Producto no encontrado",
        } as any);
      }

      // Usamos 'any' para evitar errores de TypeScript al añadir la propiedad image
      const updateData: any = { ...req.body };
      
      if (req.body.isCarousel !== undefined) {
        updateData.isCarousel = req.body.isCarousel === 'true' || req.body.isCarousel === true;
      }
      if (req.body.isSpecial !== undefined) {
        updateData.isSpecial = req.body.isSpecial === 'true' || req.body.isSpecial === true;
      }

      delete updateData.id;
      delete updateData._id;
      delete updateData.__v;
      delete updateData.CreatedAt;
      delete updateData.UpdatedAt;

      // 👇 --- LO NUEVO PARA CLOUDINARY --- 👇
      // Si el middleware interceptó un archivo nuevo, usamos su URL
      if (req.file) {
        updateData.image = req.file.path;

        // Si hay una imagen anterior, la eliminamos de Cloudinary
        if (oldProduct.image && oldProduct.image !== updateData.image) {
          deleteImageFromCloudinary(oldProduct.image);
        }
      }
      // 👆 -------------------------------- 👆

      const updatedProduct = await ProductModel.findOneAndUpdate(
        { id },
        { $set: { ...updateData, UpdatedAt: new Date() } },
        { new: true },
      );

      return res.status(200).json({
        ok: true,
        message: "Producto actualizado correctamente",
        product: updatedProduct,
      } as any);
    } catch (error) {
      console.error("error al actualizar el producto", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al actualizar el producto",
      } as any);
    }
  }
  public async delete(req: Request, res: Response): Promise<ProductResponse> {
    try {
      const { id } = req.params;

      const deletedProduct = await ProductModel.findOneAndDelete({ id });

      if (!deletedProduct) {
        return res.status(404).json({
          ok: false,
          error_message: "Producto no encontrado",
        } as any);
      }

      // 👇 --- LO NUEVO PARA CLOUDINARY --- 👇
      // Si el producto borrado tenía una imagen, la eliminamos de la nube
      if (deletedProduct.image) {
        deleteImageFromCloudinary(deletedProduct.image);
      }
      // 👆 -------------------------------- 👆

      return res.status(200).json({
        ok: true,
        message: "Producto eliminado correctamente",
      } as any);
    } catch (error) {
      console.error("error al eliminar el producto", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al eliminar el producto",
      } as any);
    }
  }
}
