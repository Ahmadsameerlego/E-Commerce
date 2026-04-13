import { Request, Response, NextFunction } from "express";
import { categoryService } from "./service";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const categoryController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await categoryService.getAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CategorySchema.parse(req.body);
      const category = await categoryService.create(data.name);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = CategorySchema.parse(req.body);
      const category = await categoryService.update(id, data.name);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await categoryService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
