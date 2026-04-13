import { Request, Response, NextFunction } from "express";
import { userService } from "./service";
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "staff"]),
});

export const userController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = UserSchema.parse(req.body);
      const user = await userService.create(data);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = UserSchema.partial().parse(req.body);
      const user = await userService.update(id, data);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await userService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
