import { Request, Response, NextFunction } from "express";
import { productService } from "./service";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock must be positive"),
  status: z.enum(["active", "out_of_stock", "low_stock", "draft"]),
  categoryId: z.string().optional(),
});

export const productController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productService.getAll();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const product = await productService.getById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = ProductSchema.parse(req.body);
      const product = await productService.create(data);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = ProductSchema.partial().parse(req.body);
      const product = await productService.update(id, data);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await productService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
